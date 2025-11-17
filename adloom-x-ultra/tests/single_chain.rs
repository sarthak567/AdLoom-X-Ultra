// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

//! Integration testing for the adloom_x_ultra application.

#![cfg(not(target_arch = "wasm32"))]

use adloom_x_ultra::Operation;
use linera_sdk::test::{QueryOutcome, TestValidator};

/// Integration test that walks through a full attention loop on a single chain.
#[tokio::test(flavor = "multi_thread")]
async fn single_chain_test() {
    let (validator, module_id) =
        TestValidator::with_current_module::<adloom_x_ultra::AdloomXUltraAbi, (), ()>().await;
    let mut chain = validator.new_chain().await;

    let application_id = chain.create_application(module_id, (), (), vec![]).await;

    chain
        .add_block(|block| {
            block.with_operation(
                application_id,
                Operation::RegisterViewer {
                    viewer_id: "viewer-a".into(),
                    handle: "@fluxseer".into(),
                },
            );
            block.with_operation(
                application_id,
                Operation::RegisterCreator {
                    creator_id: "creator-a".into(),
                    handle: "PrimeLabs".into(),
                    category: "ai-music".into(),
                },
            );
            block.with_operation(
                application_id,
                Operation::RegisterAdvertiser {
                    advertiser_id: "adv-a".into(),
                    brand: "PulseDrip".into(),
                    floor_cpm_micros: 1800,
                },
            );
            block.with_operation(
                application_id,
                Operation::FundCampaign {
                    advertiser_id: "adv-a".into(),
                    amount: "5000".into(),
                },
            );
        })
        .await;

    chain
        .add_block(|block| {
            block.with_operation(
                application_id,
                Operation::RecordAttention {
                    advertiser_id: "adv-a".into(),
                    creator_id: "creator-a".into(),
                    viewer_id: "viewer-a".into(),
                    attn_units: 3,
                    reward_per_unit: "50".into(),
                },
            );
        })
        .await;

    let QueryOutcome { response, .. } = chain
        .graphql_query(
            application_id,
            "query { global { viewers totalImpressions } viewer(id: \"viewer-a\") { handle } }",
        )
        .await;

    assert_eq!(response["global"]["viewers"].as_i64().unwrap(), 1);
    assert_eq!(response["global"]["totalImpressions"].as_i64().unwrap(), 3);
    assert_eq!(response["viewer"]["handle"].as_str().unwrap(), "@fluxseer");
}
