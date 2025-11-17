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
            Operation::RegisterCampaign {
                advertiser_id,
                campaign_id,
                budget,
                floor_cpm_micros,
            } => {
                let parsed = parse_amount(&budget);
                ledger
                    .register_campaign(&advertiser_id, campaign_id, parsed, floor_cpm_micros)
                    .expect("campaign registration failed");
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
            Operation::RecordVerifiedView {
                campaign_id,
                advertiser_id,
                creator_id,
                viewer_id,
                attn_units,
                reward_per_unit,
            } => {
                let parsed_reward = parse_amount(&reward_per_unit);
                ledger
                    .record_verified_view(
                        campaign_id.as_deref(),
                        &advertiser_id,
                        &creator_id,
                        &viewer_id,
                        attn_units,
                        parsed_reward,
                    )
                    .expect("attention logging failed");
            }
            Operation::EvolveAdVariant {
                campaign_id,
                variant_id,
                headline,
                status,
            } => {
                ledger
                    .evolve_ad_variant(&campaign_id, variant_id, headline, status)
                    .expect("variant evolution failed");
            }
            Operation::StakeCreatorVault { creator_id, amount } => {
                let parsed = parse_amount(&amount);
                ledger
                    .stake_creator_vault(&creator_id, parsed)
                    .expect("vault stake failed");
            }
            Operation::HarvestCreatorVaultYield { creator_id } => {
                ledger
                    .harvest_creator_vault(&creator_id)
                    .expect("vault harvest failed");
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
            Operation::RequestAfiLoan { viewer_id, amount } => {
                let parsed = parse_amount(&amount);
                ledger
                    .request_afi_loan(&viewer_id, parsed)
                    .expect("loan request failed");
            }
            Operation::RepayAfiLoan { viewer_id, amount } => {
                let parsed = parse_amount(&amount);
                ledger
                    .repay_afi_loan(&viewer_id, parsed)
                    .expect("loan repayment failed");
            }
            Operation::SubmitBrandInstruction {
                advertiser_id,
                instruction,
            } => {
                ledger
                    .submit_brand_instruction(&advertiser_id, instruction)
                    .expect("instruction submission failed");
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

        app.execute_operation(Operation::RegisterCampaign {
            advertiser_id: "adv-alpha".into(),
            campaign_id: "camp-alpha".into(),
            budget: "1000".into(),
            floor_cpm_micros: 1500,
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RecordVerifiedView {
            campaign_id: Some("camp-alpha".into()),
            advertiser_id: "adv-alpha".into(),
            creator_id: "creator-alpha".into(),
            viewer_id: "viewer-alpha".into(),
            attn_units: 5,
            reward_per_unit: "10".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::StakeCreatorVault {
            creator_id: "creator-alpha".into(),
            amount: "200".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::HarvestCreatorVaultYield {
            creator_id: "creator-alpha".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RequestAfiLoan {
            viewer_id: "viewer-alpha".into(),
            amount: "50".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::RepayAfiLoan {
            viewer_id: "viewer-alpha".into(),
            amount: "25".into(),
        })
        .now_or_never()
        .unwrap();

        app.execute_operation(Operation::SubmitBrandInstruction {
            advertiser_id: "adv-alpha".into(),
            instruction: "Boost eco narratives".into(),
        })
        .now_or_never()
        .unwrap();

        let ledger = app.state.ledger.get().clone();
        let viewer = ledger.viewers.get("viewer-alpha").unwrap();
        let creator = ledger.creators.get("creator-alpha").unwrap();
        let campaign = ledger.campaigns.get("camp-alpha").unwrap();
        assert!(viewer.total_earned > 0);
        assert_eq!(viewer.lifetime_impressions, 5);
        assert!(creator.total_earned > 0);
        assert_eq!(ledger.total_impressions, 5);
        assert_eq!(campaign.impressions_served, 5);
        assert!(ledger.creator_vaults.contains_key("creator-alpha"));
        assert!(ledger.viewer_loans.contains_key("viewer-alpha"));
        assert_eq!(
            ledger.brand_instructions.last().unwrap().instruction,
            "Boost eco narratives"
        );
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
