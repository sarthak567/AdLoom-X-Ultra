use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

const MAX_EVENT_HISTORY: usize = 120;
const VIEWER_SHARE_BPS: u128 = 3_500;
const CREATOR_SHARE_BPS: u128 = 5_500;
const BPS_DENOMINATOR: u128 = 10_000;

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct ViewerAccount {
    pub handle: String,
    pub attention_score: u64,
    pub total_earned: u128,
    pub lifetime_impressions: u64,
    pub outstanding_credit: u128,
    pub credit_limit: u128,
}

impl ViewerAccount {
    pub fn new(handle: String) -> Self {
        Self {
            handle,
            attention_score: 0,
            total_earned: 0,
            lifetime_impressions: 0,
            outstanding_credit: 0,
            credit_limit: 5,
        }
    }

    pub fn sync_credit_limit(&mut self) {
        self.credit_limit = derived_credit_limit(self.attention_score);
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreatorAccount {
    pub handle: String,
    pub category: String,
    pub total_earned: u128,
    pub impressions_served: u64,
    pub ai_optimization: bool,
}

impl CreatorAccount {
    pub fn new(handle: String, category: String) -> Self {
        Self {
            handle,
            category,
            total_earned: 0,
            impressions_served: 0,
            ai_optimization: true,
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct AdvertiserAccount {
    pub brand: String,
    pub ai_notes: String,
    pub total_deposited: u128,
    pub budget_remaining: u128,
    pub floor_cpm_micros: u64,
    pub auto_bid_multiplier_bps: u64,
}

impl AdvertiserAccount {
    pub fn new(brand: String, floor_cpm_micros: u64) -> Self {
        Self {
            brand,
            ai_notes: String::from("Autopilot awaiting first signal."),
            total_deposited: 0,
            budget_remaining: 0,
            floor_cpm_micros,
            auto_bid_multiplier_bps: 10_000,
        }
    }

    pub fn configure(&mut self, notes: String, floor_cpm_micros: u64) {
        self.ai_notes = notes;
        self.floor_cpm_micros = floor_cpm_micros;
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct AttentionEvent {
    pub id: u64,
    pub viewer_id: String,
    pub creator_id: String,
    pub advertiser_id: String,
    pub attn_units: u64,
    pub reward: u128,
    pub viewer_share: u128,
    pub creator_share: u128,
    pub protocol_share: u128,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct AdloomLedger {
    pub viewers: BTreeMap<String, ViewerAccount>,
    pub creators: BTreeMap<String, CreatorAccount>,
    pub advertisers: BTreeMap<String, AdvertiserAccount>,
    pub attention_events: Vec<AttentionEvent>,
    pub protocol_treasury: u128,
    pub total_advertiser_value_locked: u128,
    pub total_impressions: u64,
    pub next_event_id: u64,
}

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct AdloomXUltraState {
    pub ledger: RegisterView<AdloomLedger>,
}

impl AdloomLedger {
    pub fn bootstrap() -> Self {
        Self::default()
    }

    pub fn register_viewer(&mut self, viewer_id: String, handle: String) -> Result<(), String> {
        if self.viewers.contains_key(&viewer_id) {
            return Err(format!("viewer `{viewer_id}` already registered"));
        }
        self.viewers.insert(viewer_id, ViewerAccount::new(handle));
        Ok(())
    }

    pub fn register_creator(
        &mut self,
        creator_id: String,
        handle: String,
        category: String,
    ) -> Result<(), String> {
        if self.creators.contains_key(&creator_id) {
            return Err(format!("creator `{creator_id}` already registered"));
        }
        self.creators
            .insert(creator_id, CreatorAccount::new(handle, category));
        Ok(())
    }

    pub fn register_advertiser(
        &mut self,
        advertiser_id: String,
        brand: String,
        floor_cpm_micros: u64,
    ) -> Result<(), String> {
        if self.advertisers.contains_key(&advertiser_id) {
            return Err(format!("advertiser `{advertiser_id}` already registered"));
        }
        self.advertisers.insert(
            advertiser_id,
            AdvertiserAccount::new(brand, floor_cpm_micros),
        );
        Ok(())
    }

    pub fn fund_campaign(&mut self, advertiser_id: &str, amount: u128) -> Result<(), String> {
        let advertiser = self
            .advertisers
            .get_mut(advertiser_id)
            .ok_or_else(|| format!("advertiser `{advertiser_id}` missing"))?;
        advertiser.total_deposited += amount;
        advertiser.budget_remaining += amount;
        self.total_advertiser_value_locked += amount;
        Ok(())
    }

    pub fn configure_ai_agent(
        &mut self,
        advertiser_id: &str,
        ai_notes: String,
        floor_cpm_micros: u64,
        bid_multiplier_bps: u64,
    ) -> Result<(), String> {
        let advertiser = self
            .advertisers
            .get_mut(advertiser_id)
            .ok_or_else(|| format!("advertiser `{advertiser_id}` missing"))?;
        advertiser.configure(ai_notes, floor_cpm_micros);
        advertiser.auto_bid_multiplier_bps = bid_multiplier_bps;
        Ok(())
    }

    pub fn request_credit(&mut self, viewer_id: &str, amount: u128) -> Result<(), String> {
        let viewer = self
            .viewers
            .get_mut(viewer_id)
            .ok_or_else(|| format!("viewer `{viewer_id}` missing"))?;
        viewer.sync_credit_limit();
        if viewer.outstanding_credit + amount > viewer.credit_limit {
            return Err(format!(
                "credit request exceeds limit (requested {}, limit {})",
                amount, viewer.credit_limit
            ));
        }
        viewer.outstanding_credit += amount;
        Ok(())
    }

    pub fn clear_credit(&mut self, viewer_id: &str, amount: u128) -> Result<(), String> {
        let viewer = self
            .viewers
            .get_mut(viewer_id)
            .ok_or_else(|| format!("viewer `{viewer_id}` missing"))?;
        let applied = amount.min(viewer.outstanding_credit);
        viewer.outstanding_credit -= applied;
        self.protocol_treasury += applied;
        Ok(())
    }

    pub fn record_attention(
        &mut self,
        advertiser_id: &str,
        creator_id: &str,
        viewer_id: &str,
        attn_units: u64,
        reward_per_unit: u128,
    ) -> Result<(), String> {
        if attn_units == 0 {
            return Err("attention units must be > 0".into());
        }
        let reward = reward_per_unit
            .checked_mul(attn_units as u128)
            .ok_or_else(|| "reward overflow".to_string())?;

        let advertiser = self
            .advertisers
            .get_mut(advertiser_id)
            .ok_or_else(|| format!("advertiser `{advertiser_id}` missing"))?;
        if advertiser.budget_remaining < reward {
            return Err("insufficient advertiser budget".into());
        }
        advertiser.budget_remaining -= reward;
        self.total_advertiser_value_locked =
            self.total_advertiser_value_locked.saturating_sub(reward);

        let creator = self
            .creators
            .get_mut(creator_id)
            .ok_or_else(|| format!("creator `{creator_id}` missing"))?;
        let viewer = self
            .viewers
            .get_mut(viewer_id)
            .ok_or_else(|| format!("viewer `{viewer_id}` missing"))?;

        let creator_share = reward * CREATOR_SHARE_BPS / BPS_DENOMINATOR;
        let mut viewer_share = reward * VIEWER_SHARE_BPS / BPS_DENOMINATOR;
        let protocol_share = reward.saturating_sub(creator_share + viewer_share);

        let auto_repay = if viewer.outstanding_credit > 0 {
            let repayment_cap = viewer_share * 40 / 100;
            let repay = repayment_cap.min(viewer.outstanding_credit);
            viewer.outstanding_credit -= repay;
            repay
        } else {
            0
        };
        viewer_share -= auto_repay;
        self.protocol_treasury += protocol_share + auto_repay;

        viewer.total_earned += viewer_share;
        viewer.attention_score = viewer.attention_score.saturating_add(attn_units);
        viewer.lifetime_impressions = viewer.lifetime_impressions.saturating_add(attn_units);
        viewer.sync_credit_limit();

        creator.total_earned += creator_share;
        creator.impressions_served = creator.impressions_served.saturating_add(attn_units);

        self.total_impressions = self.total_impressions.saturating_add(attn_units);

        let event = AttentionEvent {
            id: self.next_event_id,
            viewer_id: viewer_id.to_string(),
            creator_id: creator_id.to_string(),
            advertiser_id: advertiser_id.to_string(),
            attn_units,
            reward,
            viewer_share,
            creator_share,
            protocol_share: protocol_share + auto_repay,
        };
        self.next_event_id += 1;
        self.push_event(event);
        Ok(())
    }

    fn push_event(&mut self, event: AttentionEvent) {
        self.attention_events.push(event);
        if self.attention_events.len() > MAX_EVENT_HISTORY {
            let drain = self.attention_events.len() - MAX_EVENT_HISTORY;
            self.attention_events.drain(0..drain);
        }
    }

    pub fn outstanding_credit_total(&self) -> u128 {
        self.viewers
            .values()
            .map(|viewer| viewer.outstanding_credit)
            .sum()
    }
}

fn derived_credit_limit(score: u64) -> u128 {
    let dynamic = (score as u128 / 5).max(5);
    5 + dynamic
}
