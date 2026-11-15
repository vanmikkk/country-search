# Design Decisions

## 1. Request Cancellation

The application uses `AbortController` to cancel outdated search requests.

Every time the user changes the search input, the previous active request is aborted immediately using `controller.abort()`. This happens before the debounce delay, so an outdated request cannot continue unnecessarily while the user is typing.

A new `AbortController` is created when the debounced search starts. Its `signal` is passed to `searchCountries`, which uses it to control the `fetch` request.

The application also uses a `requestId` counter as an additional safeguard. Each new search increments the counter. When a request completes, its identifier is compared with the current one. Results from outdated requests are ignored.

The identifier check does not replace actual request cancellation. `AbortController` performs the cancellation, while `requestId` provides additional protection against outdated responses.

### Error handling

The application distinguishes between different request outcomes:

- `AbortError` — the request was intentionally cancelled because the user entered a new query or cleared the input. It is not displayed as an error.
- `TimeoutError` — the request exceeded the allowed time. It is treated as a real error and displayed to the user.
- `HttpError` — an HTTP response with an unsuccessful status other than 404.
- `404` — means that no countries match the query, so an empty array is returned instead of an error.

`AbortSignal.any()` combines the user-controlled signal and the timeout signal into one signal passed to `fetch`.

Relevant files:

- `src/createCountrySearch.ts`
- `src/searchCountries.ts`

## 2. Debounce Delay

The application uses a debounce delay of 300 milliseconds.

This value provides a balance between responsiveness and reducing unnecessary network requests.

When the user types, the previous timer is cleared and a new timer is scheduled. The search starts only after the user has stopped typing for 300 milliseconds.

If debounce were removed, a network request would be sent for every input change. This would increase the number of requests and could cause unnecessary server load.

If the delay were significantly increased, fewer requests would be sent, but the interface would feel slower because users would have to wait longer for results.

The debounce implementation also provides a `cancel()` method, which allows a pending search to be cancelled when the input is cleared.

Relevant file:

- `src/debounce.ts`

## 3. Big O Complexity

The `mapCountryResponse` function transforms a country API response into a simplified `CountryCard` object.

Let `n` be the number of languages in a country.

**Time complexity: O(n)**

The function copies a fixed number of properties and uses `Array.map()` to iterate over the languages array once. Therefore, its execution time grows linearly with the number of languages.

**Space complexity: O(n)**

The function creates a new country card object and a new array containing the language names. The new languages array requires additional memory proportional to the number of languages.

The original API response is not modified.

No response cache or request deduplication has been implemented.

Relevant file:

- `src/mapCountryResponse.ts`

## 4. Clean Code Principles

The application follows several clean code principles.

### Single Responsibility Principle

Each module has a specific responsibility:

- `src/debounce.ts` — delays function execution and manages its timer.
- `src/searchCountries.ts` — performs API requests and handles HTTP responses.
- `src/createCountrySearch.ts` — coordinates debouncing, request cancellation and response handling.
- `src/mapCountryResponse.ts` — transforms API data into a simplified card model.
- `src/renderCountryCards.ts` — creates country result cards.
- `src/renderCountryDetails.ts` — renders detailed country information.
- `src/getCountryByCode.ts` — retrieves detailed country data by country code.

### Separation of Concerns

Application logic is separated from DOM rendering.

Search, debounce, request cancellation and data mapping are implemented in separate modules. UI elements are created using DOM methods in `src/index.ts`.

### Pure Functions

`mapCountryResponse` does not modify its input or perform side effects. It returns a new object based on the provided country data.

### Type Safety

TypeScript interfaces and types are defined in `src/types.ts`. They describe country data, language information, currencies and country cards.

Explicit types help detect incorrect data usage during development.

### Error Handling

HTTP errors, missing search results, request cancellation and timeouts are handled separately. This makes error behavior more predictable and prevents intentional request cancellation from being displayed as a failure.

### Avoiding Unsafe HTML Injection

Dynamic content is created using DOM methods such as `document.createElement()`, `textContent` and `append()`. The application does not use `innerHTML` or `insertAdjacentHTML` for dynamic content.
