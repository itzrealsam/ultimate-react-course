import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  currency: "USD",
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
      state.error = null;
    },
    withdraw(state, action) {
      if (action.payload <= 0 || state.balance < action.payload) return;
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0 || action.payload.amount <= 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state) {
      if (state.loan === 0 || state.balance < state.loan) return;

      // Deduct balance BEFORE resetting state.loan to 0
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
      state.error = null;
    },
    error(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, depositCurrency) {
  if (amount <= 0) {
    return accountSlice.actions.error(
      "Deposit amount must be greater than zero.",
    );
  }

  return async function (dispatch, getState) {
    const targetCurrency = getState().account?.currency || "USD";

    if (depositCurrency === targetCurrency) {
      dispatch(accountSlice.actions.deposit(amount));
      return;
    }

    dispatch(accountSlice.actions.convertingCurrency());

    try {
      const url = `https://api.frankfurter.dev/v2/rates?base=${depositCurrency}&quotes=${targetCurrency}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.status}`);
      }

      const data = await response.json();
      const baseRate = data[0]?.rate;

      if (baseRate == null) {
        throw new Error("Exchange rate not found");
      }

      const convertedAmount = amount * baseRate;
      dispatch(accountSlice.actions.deposit(convertedAmount));
    } catch (err) {
      dispatch(accountSlice.actions.error(err.message));
    }
  };
}

export default accountSlice.reducer;
