export const PriorityRequestorForm = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="mb-8 rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500/30 p-6">
      <div>
        <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2 -mt-0.5">
          Priority Requestor List
        </h4>
        <div className="text-sm text-amber-800 dark:text-amber-300 space-y-3">
          <p>
            For the best experience, we offer a priority requestor list that
            provides optimal performance for proof requests. Fill out the form
            below to be considered for testing credits and priority access.
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
        >
          {isExpanded ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Hide Form
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Show Form
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 rounded-lg overflow-hidden border border-amber-500/30 bg-white dark:bg-gray-900">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSc_15rCD5hl1rPXQmQ2NPVCEIO6aEHqMBN55tu8YJzDNCwEnQ/viewform?embedded=true"
              width="100%"
              height="986"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              className="w-full"
              title="Priority Requestor Registration Form"
            >
              Loading…
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
};
