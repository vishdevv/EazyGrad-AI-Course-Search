// Loading, error, and empty state UI components for the search results area.

export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Finding the best programs for you…
      </p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
        <ErrorIcon />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-900">Something went wrong</p>
        <p className="text-sm text-gray-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptySearchState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-3 text-center"
      aria-live="polite"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
        <EmptyIcon />
      </div>
      <p className="text-sm font-medium text-gray-900">No programs found</p>
      <p className="text-sm text-gray-500 max-w-sm">
        Our AI couldn&apos;t find a strong match for that query. Try describing your
        educational background, career goal, or the industry you want to work in.
      </p>
    </div>
  );
}

export function EmptyFilterState({ onClear }: { onClear: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-3 text-center"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-gray-900">
        No results match your filters
      </p>
      <p className="text-sm text-gray-500">
        Try adjusting or clearing the active filters.
      </p>
      <button
        onClick={onClear}
        className="mt-1 text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
      >
        Clear filters
      </button>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="h-5 w-5 text-red-500"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
