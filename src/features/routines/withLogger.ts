// Middleware nhận reducer gốc và trả lại reducer cùng kiểu đầu vào/đầu ra.
export function withLogger<State, Action extends { type: string }>(
  reducer: (state: State, action: Action) => State,
): (state: State, action: Action) => State {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(action.type, { before: state, after: nextState });
    }
    return nextState;
  };
}
