import { useMemo, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { useToast } from '../context/ToastContext';

const MUTATION_REGISTER_VIEWER = gql`
  mutation RegisterViewer($viewer_id: String!, $handle: String!) {
    registerViewer(viewer_id: $viewer_id, handle: $handle)
  }
`;

const MUTATION_REGISTER_CREATOR = gql`
  mutation RegisterCreator($creator_id: String!, $handle: String!, $category: String!) {
    registerCreator(creator_id: $creator_id, handle: $handle, category: $category)
  }
`;

const MUTATION_REGISTER_ADVERTISER = gql`
  mutation RegisterAdvertiser($advertiser_id: String!, $brand: String!, $floor_cpm_micros: Int!) {
    registerAdvertiser(advertiser_id: $advertiser_id, brand: $brand, floor_cpm_micros: $floor_cpm_micros)
  }
`;

const MUTATION_FUND_CAMPAIGN = gql`
  mutation FundCampaign($advertiser_id: String!, $amount: String!) {
    fundCampaign(advertiser_id: $advertiser_id, amount: $amount)
  }
`;

const MUTATION_REGISTER_CAMPAIGN = gql`
  mutation RegisterCampaign($advertiser_id: String!, $campaign_id: String!, $budget: String!, $floor_cpm_micros: Int!) {
    registerCampaign(advertiser_id: $advertiser_id, campaign_id: $campaign_id, budget: $budget, floor_cpm_micros: $floor_cpm_micros)
  }
`;

const MUTATION_CONFIGURE_AI_AGENT = gql`
  mutation ConfigureAiAgent($advertiser_id: String!, $ai_notes: String!, $floor_cpm_micros: Int!, $bid_multiplier_bps: Int!) {
    configureAiAgent(advertiser_id: $advertiser_id, ai_notes: $ai_notes, floor_cpm_micros: $floor_cpm_micros, bid_multiplier_bps: $bid_multiplier_bps)
  }
`;

const MUTATION_STAKE_VAULT = gql`
  mutation StakeCreatorVault($creator_id: String!, $amount: String!) {
    stakeCreatorVault(creator_id: $creator_id, amount: $amount)
  }
`;

const MUTATION_HARVEST_VAULT = gql`
  mutation HarvestCreatorVaultYield($creator_id: String!) {
    harvestCreatorVaultYield(creator_id: $creator_id)
  }
`;

const MUTATION_REQUEST_AFI_LOAN = gql`
  mutation RequestAfiLoan($viewer_id: String!, $amount: String!) {
    requestAfiLoan(viewer_id: $viewer_id, amount: $amount)
  }
`;

const MUTATION_REPAY_AFI_LOAN = gql`
  mutation RepayAfiLoan($viewer_id: String!, $amount: String!) {
    repayAfiLoan(viewer_id: $viewer_id, amount: $amount)
  }
`;

const MUTATION_SUBMIT_BRAND_INSTRUCTION = gql`
  mutation SubmitBrandInstruction($advertiser_id: String!, $instruction: String!) {
    submitBrandInstruction(advertiser_id: $advertiser_id, instruction: $instruction)
  }
`;

const MUTATION_RECORD_VERIFIED_VIEW = gql`
  mutation RecordVerifiedView(
    $campaign_id: String
    $advertiser_id: String!
    $creator_id: String!
    $viewer_id: String!
    $attn_units: Int!
    $reward_per_unit: String!
  ) {
    recordVerifiedView(
      campaign_id: $campaign_id
      advertiser_id: $advertiser_id
      creator_id: $creator_id
      viewer_id: $viewer_id
      attn_units: $attn_units
      reward_per_unit: $reward_per_unit
    )
  }
`;

interface MutationState {
  loading: boolean;
  error: string | null;
}

export function useAdloomMutations() {
  const endpoint = useMemo(
    () => import.meta.env.VITE_LINERA_GRAPHQL_URL?.trim(),
    [],
  );
  const [state, setState] = useState<MutationState>({ loading: false, error: null });
  const toast = useToast();

  const client = useMemo(() => {
    if (!endpoint) return null;
    return new GraphQLClient(endpoint, { fetch });
  }, [endpoint]);

  const executeMutation = async <T,>(
    mutation: string,
    variables: Record<string, unknown>,
    onSuccess?: () => void,
    successMessage?: string,
  ): Promise<T | null> => {
    if (!client) {
      // Fallback to local storage simulation
      if (onSuccess) onSuccess();
      if (successMessage) toast.success(successMessage);
      return null;
    }

    setState({ loading: true, error: null });
    try {
      const result = await client.request<T>(mutation, variables);
      setState({ loading: false, error: null });
      if (onSuccess) onSuccess();
      if (successMessage) toast.success(successMessage);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Mutation failed';
      setState({ loading: false, error: errorMsg });
      toast.error(errorMsg);
      // Still call onSuccess for local fallback
      if (onSuccess) onSuccess();
      return null;
    }
  };

  return {
    ...state,
    endpoint,
    registerViewer: (viewerId: string, handle: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_REGISTER_VIEWER, { viewer_id: viewerId, handle }, onSuccess, `Viewer ${handle} registered successfully`),
    registerCreator: (creatorId: string, handle: string, category: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_REGISTER_CREATOR, { creator_id: creatorId, handle, category }, onSuccess, `Creator ${handle} registered successfully`),
    registerAdvertiser: (advertiserId: string, brand: string, floorCpmMicros: number, onSuccess?: () => void) =>
      executeMutation(MUTATION_REGISTER_ADVERTISER, { advertiser_id: advertiserId, brand, floor_cpm_micros: floorCpmMicros }, onSuccess, `Advertiser ${brand} registered successfully`),
    fundCampaign: (advertiserId: string, amount: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_FUND_CAMPAIGN, { advertiser_id: advertiserId, amount }, onSuccess, `Campaign funded with ${amount} $ATTN`),
    registerCampaign: (advertiserId: string, campaignId: string, budget: string, floorCpmMicros: number, onSuccess?: () => void) =>
      executeMutation(MUTATION_REGISTER_CAMPAIGN, { advertiser_id: advertiserId, campaign_id: campaignId, budget, floor_cpm_micros: floorCpmMicros }, onSuccess, `Campaign ${campaignId} created successfully`),
    configureAiAgent: (advertiserId: string, aiNotes: string, floorCpmMicros: number, bidMultiplierBps: number, onSuccess?: () => void) =>
      executeMutation(MUTATION_CONFIGURE_AI_AGENT, { advertiser_id: advertiserId, ai_notes: aiNotes, floor_cpm_micros: floorCpmMicros, bid_multiplier_bps: bidMultiplierBps }, onSuccess, 'AI agent configured successfully'),
    stakeVault: (creatorId: string, amount: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_STAKE_VAULT, { creator_id: creatorId, amount }, onSuccess, `Staked ${amount} $ATTN in vault`),
    harvestVault: (creatorId: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_HARVEST_VAULT, { creator_id: creatorId }, onSuccess, 'Vault yield harvested successfully'),
    requestAfiLoan: (viewerId: string, amount: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_REQUEST_AFI_LOAN, { viewer_id: viewerId, amount }, onSuccess, `A-Fi loan of ${amount} $ATTN requested`),
    repayAfiLoan: (viewerId: string, amount: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_REPAY_AFI_LOAN, { viewer_id: viewerId, amount }, onSuccess, `Repaid ${amount} $ATTN on loan`),
    submitBrandInstruction: (advertiserId: string, instruction: string, onSuccess?: () => void) =>
      executeMutation(MUTATION_SUBMIT_BRAND_INSTRUCTION, { advertiser_id: advertiserId, instruction }, onSuccess, 'Brand OS instruction submitted'),
    recordVerifiedView: (
      campaignId: string | null,
      advertiserId: string,
      creatorId: string,
      viewerId: string,
      attnUnits: number,
      rewardPerUnit: string,
      onSuccess?: () => void,
    ) =>
      executeMutation(MUTATION_RECORD_VERIFIED_VIEW, {
        campaign_id: campaignId,
        advertiser_id: advertiserId,
        creator_id: creatorId,
        viewer_id: viewerId,
        attn_units: attnUnits,
        reward_per_unit: rewardPerUnit,
      }, onSuccess, 'Verified view recorded'),
  };
}

