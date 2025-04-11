export default function LoadingState() {
    return (
      <section className="bg-black flex min-h-screen items-center justify-center">
        <div
          role="status"
          className="bg-black border-green-400 max-w-sm animate-pulse rounded-2xl border-2 p-4 shadow md:p-6"
        >
            <div className="bg-green-400 mb-4 flex h-48 items-center justify-center rounded-3xl">
            <img
                src="/Logo/Rick_and_Morty.svg"
                alt="Rick and Morty Logo"
                className="h-48 w-48"
            />
            </div>

          <div className="bg-green-400 mb-4 h-2.5 w-48 rounded-full" />
          <div className="bg-green-400 mb-2.5 h-2 rounded-full" />
          <div className="bg-green-400 mb-2.5 h-2 rounded-full" />
          <div className="bg-green-400 h-2 rounded-full" />
          <div className="mt-4 flex items-center gap-3">
            <svg
              className="text-green-400 h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div>
              <div className="mb-2 h-2.5 w-32 rounded-full bg-gray-700" />
              <div className="h-2 w-48 rounded-full bg-gray-700" />
            </div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }
  