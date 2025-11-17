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

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct AdVariant {
    pub variant_id: String,
    pub headline: String,
    pub status: String,
    pub ctr_bps: u64,
    pub last_mutation_slot: u64,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct Campaign {
    pub id: String,
    pub advertiser_id: String,
    pub budget: u128,
    pub budget_remaining: u128,
    pub floor_cpm_micros: u64,
    pub ad_variants: Vec<AdVariant>,
    pub impressions_served: u64,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct CreatorVault {
    pub creator_id: String,
    pub staked_amount: u128,
    pub apy_bps: u64,
    pub last_harvest_slot: u64,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct AfiLoan {
    pub viewer_id: String,
    pub principal: u128,
    pub outstanding: u128,
    pub status: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct BrandInstruction {
    pub id: u64,
    pub advertiser_id: String,
    pub instruction: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct AttentionEvent {
    pub id: u64,
    pub campaign_id: Option<String>,
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
    pub campaigns: BTreeMap<String, Campaign>,
    pub creator_vaults: BTreeMap<String, CreatorVault>,
    pub viewer_loans: BTreeMap<String, AfiLoan>,
    pub brand_instructions: Vec<BrandInstruction>,
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

    pub fn register_campaign(
        &mut self,
        advertiser_id: &str,
        campaign_id: String,
        budget: u128,
        floor_cpm_micros: u64,
    ) -> Result<(), String> {
        if self.campaigns.contains_key(&campaign_id) {
            return Err(format!("campaign `{campaign_id}` already exists"));
        }
        let advertiser = self
            .advertisers
            .get(advertiser_id)
            .ok_or_else(|| format!("advertiser `{advertiser_id}` missing"))?;
        let mut cloned = advertiser.clone();
        cloned.total_deposited += budget;
        cloned.budget_remaining += budget;
        drop(cloned);
        self.fund_campaign(advertiser_id, budget)?;
        let campaign = Campaign {
            id: campaign_id.clone(),
            advertiser_id: advertiser_id.to_string(),
            budget,
            budget_remaining: budget,
            floor_cpm_micros,
            ad_variants: vec![],
            impressions_served: 0,
        };
        self.campaigns.insert(campaign_id, campaign);
        Ok(())
    }

    pub fn evolve_ad_variant(
        &mut self,
        campaign_id: &str,
        variant_id: String,
        headline: String,
        status: String,
    ) -> Result<(), String> {
        let campaign = self
            .campaigns
            .get_mut(campaign_id)
            .ok_or_else(|| format!("campaign `{campaign_id}` missing"))?;
        let slot = self.next_event_id;
        if let Some(existing) = campaign
            .ad_variants
            .iter_mut()
            .find(|variant| variant.variant_id == variant_id)
        {
            existing.headline = headline;
            existing.status = status;
            existing.last_mutation_slot = slot;
        } else {
            campaign.ad_variants.push(AdVariant {
                variant_id,
                headline,
                status,
                ctr_bps: 0,
                last_mutation_slot: slot,
            });
        }
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

    pub fn record_verified_view(
        &mut self,
        campaign_id: Option<&str>,
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

        let mut campaign_ref = None;
        if let Some(id) = campaign_id {
            let campaign = self
                .campaigns
                .get_mut(id)
                .ok_or_else(|| format!("campaign `{id}` missing"))?;
            if campaign.budget_remaining < reward {
                return Err("insufficient campaign budget".into());
            }
            campaign.budget_remaining -= reward;
            campaign.impressions_served = campaign.impressions_served.saturating_add(attn_units);
            campaign_ref = Some(campaign.id.clone());
        }

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
            campaign_id: campaign_ref,
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

    pub fn stake_creator_vault(&mut self, creator_id: &str, amount: u128) -> Result<(), String> {
        if !self.creators.contains_key(creator_id) {
            return Err(format!("creator `{creator_id}` missing"));
        }
        let slot = self.next_event_id;
        let vault = self
            .creator_vaults
            .entry(creator_id.to_string())
            .or_insert(CreatorVault {
                creator_id: creator_id.to_string(),
                staked_amount: 0,
                apy_bps: 1_200,
                last_harvest_slot: slot,
            });
        vault.staked_amount += amount;
        vault.last_harvest_slot = slot;
        Ok(())
    }

    pub fn harvest_creator_vault(&mut self, creator_id: &str) -> Result<u128, String> {
        let vault = self
            .creator_vaults
            .get_mut(creator_id)
            .ok_or_else(|| format!("vault for `{creator_id}` missing"))?;
        let reward = vault.staked_amount * vault.apy_bps as u128 / BPS_DENOMINATOR / 12;
        vault.staked_amount += reward;
        vault.last_harvest_slot = self.next_event_id;
        Ok(reward)
    }

    pub fn request_afi_loan(&mut self, viewer_id: &str, amount: u128) -> Result<(), String> {
        if !self.viewers.contains_key(viewer_id) {
            return Err(format!("viewer `{viewer_id}` missing"));
        }
        let loan = self
            .viewer_loans
            .entry(viewer_id.to_string())
            .or_insert(AfiLoan {
                viewer_id: viewer_id.to_string(),
                principal: 0,
                outstanding: 0,
                status: "active".into(),
            });
        loan.principal += amount;
        loan.outstanding += amount;
        Ok(())
    }

    pub fn repay_afi_loan(&mut self, viewer_id: &str, amount: u128) -> Result<(), String> {
        let loan = self
            .viewer_loans
            .get_mut(viewer_id)
            .ok_or_else(|| format!("loan for `{viewer_id}` missing"))?;
        let applied = amount.min(loan.outstanding);
        loan.outstanding -= applied;
        if loan.outstanding == 0 {
            loan.status = "settled".into();
        }
        self.protocol_treasury += applied;
        Ok(())
    }

    pub fn submit_brand_instruction(
        &mut self,
        advertiser_id: &str,
        instruction: String,
    ) -> Result<(), String> {
        if !self.advertisers.contains_key(advertiser_id) {
            return Err(format!("advertiser `{advertiser_id}` missing"));
        }
        let entry = BrandInstruction {
            id: self.next_event_id,
            advertiser_id: advertiser_id.to_string(),
            instruction,
        };
        self.brand_instructions.push(entry);
        if self.brand_instructions.len() > 60 {
            let drain = self.brand_instructions.len() - 60;
            self.brand_instructions.drain(0..drain);
        }
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
