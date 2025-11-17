use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct AdloomXUltraAbi;

impl ContractAbi for AdloomXUltraAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for AdloomXUltraAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    RegisterViewer {
        viewer_id: String,
        handle: String,
    },
    RegisterCreator {
        creator_id: String,
        handle: String,
        category: String,
    },
    RegisterAdvertiser {
        advertiser_id: String,
        brand: String,
        floor_cpm_micros: u64,
    },
    FundCampaign {
        advertiser_id: String,
        amount: String,
    },
    ConfigureAiAgent {
        advertiser_id: String,
        ai_notes: String,
        floor_cpm_micros: u64,
        bid_multiplier_bps: u64,
    },
    RecordAttention {
        advertiser_id: String,
        creator_id: String,
        viewer_id: String,
        attn_units: u64,
        reward_per_unit: String,
    },
    RequestAttentionCredit {
        viewer_id: String,
        amount: String,
    },
    ClearAttentionCredit {
        viewer_id: String,
        amount: String,
    },
}
