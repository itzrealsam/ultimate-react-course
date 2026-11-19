const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  currency: "USD",
  isLoading: false,
  error: null,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
        error: null,
      };
    case "account/withdraw":
      if (action.payload <= 0 || state.balance < action.payload) return state;
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0 || action.payload.amount <= 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      if (state.loan === 0 || state.balance < state.loan) return state;
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "account/error":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function deposit(amount, depositCurrency) {
  if (amount <= 0) {
    return {
      type: "account/error",
      payload: "Deposit amount must be greater than zero.",
    };
  }

  return async function (dispatch, getState) {
    const targetCurrency = getState().account?.currency || "USD";

    if (depositCurrency === targetCurrency) {
      dispatch({ type: "account/deposit", payload: amount });
      return;
    }

    dispatch({ type: "account/convertingCurrency" });

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
      dispatch({ type: "account/deposit", payload: convertedAmount });
    } catch (error) {
      dispatch({ type: "account/error", payload: error.message });
    }
  };
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}
