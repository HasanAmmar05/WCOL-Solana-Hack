use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod wcol {
    use super::*;

    pub fn commit_prediction(
        ctx: Context<CommitPrediction>,
        oracle_id: String,
        match_id: String,
        outcome: u8,
        prediction_hash: [u8; 32],
    ) -> Result<()> {
        let p = &mut ctx.accounts.prediction;
        let clock = Clock::get()?;
        p.oracle_id = oracle_id;
        p.match_id = match_id;
        p.outcome = outcome;
        p.prediction_hash = prediction_hash;
        p.committed_at = clock.unix_timestamp;
        p.committer = ctx.accounts.committer.key();
        p.bump = ctx.bumps.prediction;
        msg!("Committed at: {}", p.committed_at);
        Ok(())
    }

    pub fn mint_fan_proof(
        ctx: Context<MintFanProof>,
        oracle_id: String,
        match_id: String,
        backed_outcome: u8,
    ) -> Result<()> {
        let t = &mut ctx.accounts.ticket;
        let clock = Clock::get()?;
        t.fan = ctx.accounts.fan.key();
        t.oracle_id = oracle_id;
        t.match_id = match_id;
        t.backed_outcome = backed_outcome;
        t.minted_at = clock.unix_timestamp;
        t.bump = ctx.bumps.ticket;
        msg!("FanProof minted at: {}", t.minted_at);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(oracle_id: String, match_id: String)]
pub struct CommitPrediction<'info> {
    #[account(
        init, payer = committer,
        space = 8 + 200,
        seeds = [b"pred", oracle_id.as_bytes(), match_id.as_bytes()],
        bump
    )]
    pub prediction: Account<'info, PredictionCommit>,
    #[account(mut)]
    pub committer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(oracle_id: String, match_id: String)]
pub struct MintFanProof<'info> {
    #[account(
        init, payer = fan,
        space = 8 + 200,
        seeds = [b"ticket", fan.key().as_ref(), oracle_id.as_bytes(), match_id.as_bytes()],
        bump
    )]
    pub ticket: Account<'info, FanProofTicket>,
    #[account(mut)]
    pub fan: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PredictionCommit {
    pub oracle_id: String,
    pub match_id: String,
    pub outcome: u8,
    pub prediction_hash: [u8; 32],
    pub committed_at: i64,
    pub committer: Pubkey,
    pub bump: u8,
}

#[account]
pub struct FanProofTicket {
    pub fan: Pubkey,
    pub oracle_id: String,
    pub match_id: String,
    pub backed_outcome: u8,
    pub minted_at: i64,
    pub bump: u8,
}
