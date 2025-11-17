#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Schema, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot, linera_base_types::WithServiceAbi, views::View, Service,
    ServiceRuntime,
};

use adloom_x_ultra::Operation;

use self::state::{
    AdloomLedger, AdloomXUltraState, AdvertiserAccount, AttentionEvent, CreatorAccount,
    ViewerAccount,
};

pub struct AdloomXUltraService {
    state: AdloomXUltraState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(AdloomXUltraService);

impl WithServiceAbi for AdloomXUltraService {
    type Abi = adloom_x_ultra::AdloomXUltraAbi;
}

impl Service for AdloomXUltraService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = AdloomXUltraState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AdloomXUltraService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        let ledger = self.state.ledger.get().clone();
        Schema::build(
            QueryRoot { ledger },
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish()
        .execute(query)
        .await
    }
}

struct QueryRoot {
    ledger: AdloomLedger,
}

#[Object]
impl QueryRoot {
    async fn global(&self) -> GlobalPulse {
        GlobalPulse::from_ledger(&self.ledger)
    }

    async fn viewer(&self, id: String) -> Option<ViewerSnapshot> {
        self.ledger
            .viewers
            .get(&id)
            .map(|viewer| ViewerSnapshot::from_pair(&id, viewer))
    }

    async fn creator(&self, id: String) -> Option<CreatorSnapshot> {
        self.ledger
            .creators
            .get(&id)
            .map(|creator| CreatorSnapshot::from_pair(&id, creator))
    }

    async fn advertiser(&self, id: String) -> Option<AdvertiserSnapshot> {
        self.ledger
            .advertisers
            .get(&id)
            .map(|adv| AdvertiserSnapshot::from_pair(&id, adv))
    }

    async fn leaderboard(&self, limit: Option<i32>) -> Vec<ViewerSnapshot> {
        let mut entries: Vec<_> = self.ledger.viewers.iter().collect();
        entries.sort_by(|a, b| b.1.attention_score.cmp(&a.1.attention_score));
        let take = limit.unwrap_or(5).max(0) as usize;
        entries
            .into_iter()
            .take(take)
            .map(|(id, viewer)| ViewerSnapshot::from_pair(id, viewer))
            .collect()
    }

    async fn events(&self, limit: Option<i32>) -> Vec<AttentionEventSnapshot> {
        let take = limit.unwrap_or(10).max(0) as usize;
        self.ledger
            .attention_events
            .iter()
            .rev()
            .take(take)
            .cloned()
            .map(AttentionEventSnapshot::from)
            .collect()
    }
}

#[derive(SimpleObject)]
#[graphql(rename_fields = "camelCase")]
struct GlobalPulse {
    viewers: usize,
    creators: usize,
    advertisers: usize,
    protocol_treasury: String,
    advertiser_value_locked: String,
    total_impressions: u64,
    outstanding_credit: String,
}

impl GlobalPulse {
    fn from_ledger(ledger: &AdloomLedger) -> Self {
        Self {
            viewers: ledger.viewers.len(),
            creators: ledger.creators.len(),
            advertisers: ledger.advertisers.len(),
            protocol_treasury: ledger.protocol_treasury.to_string(),
            advertiser_value_locked: ledger.total_advertiser_value_locked.to_string(),
            total_impressions: ledger.total_impressions,
            outstanding_credit: ledger.outstanding_credit_total().to_string(),
        }
    }
}

#[derive(SimpleObject)]
#[graphql(rename_fields = "camelCase")]
struct ViewerSnapshot {
    id: String,
    handle: String,
    attention_score: u64,
    total_earned: String,
    lifetime_impressions: u64,
    outstanding_credit: String,
    credit_limit: String,
}

impl ViewerSnapshot {
    fn from_pair(id: &str, viewer: &ViewerAccount) -> Self {
        Self {
            id: id.to_string(),
            handle: viewer.handle.clone(),
            attention_score: viewer.attention_score,
            total_earned: viewer.total_earned.to_string(),
            lifetime_impressions: viewer.lifetime_impressions,
            outstanding_credit: viewer.outstanding_credit.to_string(),
            credit_limit: viewer.credit_limit.to_string(),
        }
    }
}

#[derive(SimpleObject)]
#[graphql(rename_fields = "camelCase")]
struct CreatorSnapshot {
    id: String,
    handle: String,
    category: String,
    total_earned: String,
    impressions_served: u64,
    ai_optimization: bool,
}

impl CreatorSnapshot {
    fn from_pair(id: &str, creator: &CreatorAccount) -> Self {
        Self {
            id: id.to_string(),
            handle: creator.handle.clone(),
            category: creator.category.clone(),
            total_earned: creator.total_earned.to_string(),
            impressions_served: creator.impressions_served,
            ai_optimization: creator.ai_optimization,
        }
    }
}

#[derive(SimpleObject)]
#[graphql(rename_fields = "camelCase")]
struct AdvertiserSnapshot {
    id: String,
    brand: String,
    ai_notes: String,
    budget_remaining: String,
    total_deposited: String,
    floor_cpm_micros: u64,
    auto_bid_multiplier_bps: u64,
}

impl AdvertiserSnapshot {
    fn from_pair(id: &str, advertiser: &AdvertiserAccount) -> Self {
        Self {
            id: id.to_string(),
            brand: advertiser.brand.clone(),
            ai_notes: advertiser.ai_notes.clone(),
            budget_remaining: advertiser.budget_remaining.to_string(),
            total_deposited: advertiser.total_deposited.to_string(),
            floor_cpm_micros: advertiser.floor_cpm_micros,
            auto_bid_multiplier_bps: advertiser.auto_bid_multiplier_bps,
        }
    }
}

#[derive(SimpleObject)]
#[graphql(rename_fields = "camelCase")]
struct AttentionEventSnapshot {
    id: u64,
    viewer_id: String,
    creator_id: String,
    advertiser_id: String,
    attn_units: u64,
    reward: String,
    viewer_share: String,
    creator_share: String,
    protocol_share: String,
}

impl From<AttentionEvent> for AttentionEventSnapshot {
    fn from(value: AttentionEvent) -> Self {
        Self {
            id: value.id,
            viewer_id: value.viewer_id,
            creator_id: value.creator_id,
            advertiser_id: value.advertiser_id,
            attn_units: value.attn_units,
            reward: value.reward.to_string(),
            viewer_share: value.viewer_share.to_string(),
            creator_share: value.creator_share.to_string(),
            protocol_share: value.protocol_share.to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use async_graphql::Request;
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Service, ServiceRuntime};

    use super::{AdloomLedger, AdloomXUltraService, AdloomXUltraState};

    #[test]
    fn query_global_snapshot() {
        let runtime = Arc::new(ServiceRuntime::<AdloomXUltraService>::new());
        let mut state = AdloomXUltraState::load(runtime.root_view_storage_context())
            .blocking_wait()
            .expect("Failed to read from mock key value store");

        let mut ledger = AdloomLedger::bootstrap();
        ledger
            .register_viewer("viewer-1".into(), "@nova".into())
            .unwrap();
        ledger
            .register_creator("creator-1".into(), "NovaPod".into(), "audio".into())
            .unwrap();
        ledger
            .register_advertiser("adv-1".into(), "FluxCo".into(), 900)
            .unwrap();
        state.ledger.set(ledger);

        let service = AdloomXUltraService {
            state,
            runtime: runtime.clone(),
        };

        let request = Request::new(
            "{ global { viewers } viewer(id: \"viewer-1\") { handle } leaderboard(limit: 1) { id } }",
        );

        let response = service
            .handle_query(request)
            .now_or_never()
            .expect("Query should not await anything");

        let data = response.data.into_json().unwrap();
        assert_eq!(data["global"]["viewers"].as_u64().unwrap(), 1);
        assert_eq!(data["viewer"]["handle"].as_str().unwrap(), "@nova");
        assert_eq!(data["leaderboard"][0]["id"].as_str().unwrap(), "viewer-1");
    }
}
