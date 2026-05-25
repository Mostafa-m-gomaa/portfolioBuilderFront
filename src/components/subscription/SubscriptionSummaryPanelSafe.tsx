import { Component, type ErrorInfo, type ReactNode } from "react";
import SubscriptionSummaryPanel from "@/components/subscription/SubscriptionSummaryPanel";

type Props = React.ComponentProps<typeof SubscriptionSummaryPanel>;

type State = { crashed: boolean };

/** Prevents a summary render error from blanking the whole dashboard. */
class SubscriptionSummaryErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { crashed: false };

  static getDerivedStateFromError(): State {
    return { crashed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SubscriptionSummaryPanel", error, info.componentStack);
  }

  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

const SubscriptionSummaryPanelSafe = (props: Props) => (
  <SubscriptionSummaryErrorBoundary>
    <SubscriptionSummaryPanel {...props} />
  </SubscriptionSummaryErrorBoundary>
);

export default SubscriptionSummaryPanelSafe;
