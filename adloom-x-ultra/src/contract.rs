#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use adloom_x_ultra::Operation;

use self::state::{AdloomLedger, AdloomXUltraState};

fn parse_amount(input: &str) -> u128 {
    input
        .parse::<u128>()
        .unwrap_or_else(|_| panic!("invalid amount `{input}`"))
}

pub struct AdloomXUltraContract {
    state: AdloomXUltraState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(AdloomXUltraContract);

impl WithContractAbi for AdloomXUltraContract {
    type Abi = adloom_x_ultra::AdloomXUltraAbi;
}

impl Contract for AdloomXUltraContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = AdloomXUltraState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AdloomXUltraContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        self.state.ledger.set(AdloomLedger::bootstrap());
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        let mut ledger = self.state.ledger.get().clone();
        match operation {
            Operation::RegisterViewer { viewer_id, handle } => {
                ledger
                    .register_viewer(viewer_id, handle)
                    .expect("viewer registration failed");
            }
            Operation::RegisterCreator {
                creator_id,
                handle,
                category,
            } => {
                ledger
                    .register_creator(creator_id, handle, category)
                    .expect("creator registration failed");
            }
            Operation::RegisterAdvertiser {
                advertiser_id,
                brand,
                floor_cpm_micros,
            } => {
                ledger
                    .register_advertiser(advertiser_id, brand, floor_cpm_micros)
                    .expect("advertiser registration failed");
            }
            Operation::FundCampaign {
                advertiser_id,
                amount,
            } => {
                let parsed = parse_amount(&amount);
                ledger
                    .fund_campaign(&advertiser_id, parsed)
                    .expect("fund campaign failed");
            }
            Operation::ConfigureAiAgent {
                advertiser_id,
                ai_notes,
                floor_cpm_micros,
                bid_multiplier_bps,
            } => {
                ledger
                    .configure_ai_agent(
                        &advertiser_id,
                        ai_notes,
                        floor_cpm_micros,
                        bid_multiplier_bps,
                    )
                    .expect("AI mandate update failed");
            }
            Operation::RecordAttention {
                advertiser_id,
                creator_id,
                viewer_id,
                attn_units,
                reward_per_unit,
            } => {
                let parsed_reward = parse_amount(&reward_per_unit);
                ledger
                    .record_attention(
                        &advertiser_id,
                        &creator_id,
                        &viewer_id,
                        attn_units,
                        parsed_reward,
                    )
                    .expect("attention logging failed");
            }
            Operation::RequestAttentionCredit { viewer_id, amount } => {
                let parsed = parse_amount(&amount);
                ledger
                    .request_credit(&viewer_id, parsed)
                    .expect("credit request failed");
            }
            Operation::ClearAttentionCredit { viewer_id, amount } => {
                let parsed = parse_amount(&amount);
                ledger
                    .clear_credit(&viewer_id, parsed)
                    .expect("credit clearance failed");
            }
        }
        self.state.ledger.set(ledger);
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

#[cfg(test)]
mod tests {
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Contract, ContractRuntime};

    use adloom_x_ultra::Operation;

    use super::{AdloomLedger, AdloomXUltraContract, AdloomXUltraState};

    #[test]
    fn distributes_attention_reward() {
        let mut app = create_and_instantiate_app();

        // bootstrap network actors
        app.execute_operation(Operation::RegisterViewer {
            viewer_id: "viewer-alpha".into(),
            handle: "@focusmode".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RegisterCreator {
            creator_id: "creator-alpha".into(),
            handle: "HoloStudio".into(),
            category: "immersive".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RegisterAdvertiser {
            advertiser_id: "adv-alpha".into(),
            brand: "FluxThreads".into(),
            floor_cpm_micros: 1200,
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::FundCampaign {
            advertiser_id: "adv-alpha".into(),
            amount: "1000".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RecordAttention {
            advertiser_id: "adv-alpha".into(),
            creator_id: "creator-alpha".into(),
            viewer_id: "viewer-alpha".into(),
            attn_units: 5,
            reward_per_unit: "10".into(),
        })
        .now_or_never()
        .unwrap();

        let ledger = app.state.ledger.get().clone();
        let viewer = ledger.viewers.get("viewer-alpha").unwrap();
        let creator = ledger.creators.get("creator-alpha").unwrap();
        assert!(viewer.total_earned > 0);
        assert_eq!(viewer.lifetime_impressions, 5);
        assert!(creator.total_earned > 0);
        assert_eq!(ledger.total_impressions, 5);
    }

    fn create_and_instantiate_app() -> AdloomXUltraContract {
        let runtime = ContractRuntime::new().with_application_parameters(());
        let mut contract = AdloomXUltraContract {
            state: AdloomXUltraState::load(runtime.root_view_storage_context())
                .blocking_wait()
                .expect("Failed to read from mock key value store"),
            runtime,
        };

        contract
            .instantiate(())
            .now_or_never()
            .expect("Initialization of application state should not await anything");

        // ensure ledger bootstrapped
        assert_eq!(*contract.state.ledger.get(), AdloomLedger::bootstrap());

        contract
    }
}
