
import { ref, onUnmounted, nextTick, type Ref } from 'vue'

export interface UseInfiniteScrollOptions {

    /**
     * The scrollable container element (optional). Defaults to `null` (i.e., the viewport).
     * When null, uses the browser viewport as the root
     */
    root?: Ref<HTMLElement | null> | null

    /**
     * Distance in pixels before reaching the sentinel to trigger loading.
     * @default '100px'
     */
    rootMargin?: string

    /**
     * A multiplier used to determine if the container has enough content
     * (scrollHeight > clientHeight * contentThreshold) to allow loading.
     * Higher values require more content before triggering infinite scroll
     * @default 1.3
     */
    contentThreshold?: number

    /**
     * Disables the height check of the container before triggering load.
     * @default false
     */
    disableContentCheck?: boolean
}

export interface UseInfiniteScrollReturn {
    /**
     * Ref to be attached to the sentinel element (the element observed for triggering load).
     */
    sentinelRef: Ref<HTMLElement | null>

    /**
     * Indicates whether a loading operation is currently in progress.
     */
    isLoadingMore: Ref<boolean>

    /**
     * Manually clean up the IntersectionObserver.
     */
    cleanup: () => void

    /**
     * Reinitialize the IntersectionObserver.
     */
    reinitialize: () => Promise<void>
}

/**
 * Composable for managing infinite scrolling using IntersectionObserver.
 *
 * @param loadMore - Async function that loads additional content.
 * @param isLoading - Ref indicating whether a primary load is in progress.
 * @param hasReachedEnd - Ref indicating whether all content has been loaded.
 * @param options - Optional configuration parameters.
 */
export function useInfiniteScroll(
    loadMore: () => Promise<void>,
    isLoading: Ref<boolean>,
    hasReachedEnd: Ref<boolean>,
    options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {

    const {
        root = null,
        rootMargin = '100px',
        contentThreshold = 1.3,
        disableContentCheck = false
    } = options;

    const sentinelRef = ref<HTMLElement | null>(null);
    const isLoadingMore = ref(false);
    let observer: IntersectionObserver | null = null;

    /**
     * Determines whether the container has enough content to justify triggering a load.
     */
    function hasEnoughContent(): boolean {
        if (disableContentCheck) return true;

        const container = root?.value;
        if (!container) return true;

        const { scrollHeight, clientHeight } = container;
        return scrollHeight > clientHeight * contentThreshold;
    }

    /**
     * Handles conditional loading logic.
     */
    async function handleLoadMore(): Promise<void> {

        if (isLoadingMore.value || isLoading.value || hasReachedEnd.value) {
            return;
        }

        if (!hasEnoughContent()) {
            return;
        }

        isLoadingMore.value = true;

        try {
            await loadMore();
        } catch (error) {
            console.error('Error in infinite scroll loadMore:', error)
            throw error;
        } finally {
            isLoadingMore.value = false;
        }
    }

    /**
     * Sets up the IntersectionObserver instance.
     */
    function setupObserver(): void {
        if (!sentinelRef.value) return;

        observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    void handleLoadMore();
                }
            },
            {
                root: root?.value || null,
                rootMargin,
                threshold: 0
            }
        )

        observer.observe(sentinelRef.value);
    }

    /**
     * Disconnects the observer to stop watching the sentinel.
     */
    function cleanup(): void {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    /**
     * Reinitialized the observer (useful after content updates).
     */
    async function reinitialize(): Promise<void> {
        cleanup();
        await nextTick();
        if (sentinelRef.value && !hasReachedEnd.value) {
            setupObserver();
        }
    }

    // Automatically clean up the observer when the component is unmounted
    onUnmounted(() => {
        cleanup();
    })

    // Automatically set up the observer when the sentinel ref changes
    void nextTick(() => {
        if (typeof window !== 'undefined') {
            import('vue').then(({ watch }) => {
                watch(
                    sentinelRef,
                    async (newVal) => {
                        if (newVal) {
                            await nextTick();
                            setupObserver();
                        } else {
                            cleanup();
                        }
                    },
                    { immediate: true }
                )
            })
        }
    })

    return {
        sentinelRef,
        isLoadingMore,
        cleanup,
        reinitialize
    };
}