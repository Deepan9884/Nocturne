"use client";

import React from "react";

interface ViewerBoundaryProps {
  children: React.ReactNode;
  label?: string;
}

interface ViewerBoundaryState {
  hasError: boolean;
}

export class ViewerErrorBoundary extends React.Component<
  ViewerBoundaryProps,
  ViewerBoundaryState
> {
  constructor(props: ViewerBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ViewerBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dash-canvas-fallback" role="alert">
          <p>{this.props.label || "3D viewport unavailable in this browser context."}</p>
          <button
            type="button"
            className="dash-btn dash-btn--secondary"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry 3D view
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ViewerLoadingFallback({ message = "Loading 3D character…" }: { message?: string }) {
  return (
    <div className="dash-canvas-fallback" role="status" aria-live="polite">
      <div className="dash-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
