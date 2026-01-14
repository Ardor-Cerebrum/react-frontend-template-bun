import { useEffect } from 'react';
import synapse from 'ardor-synapse';

/**
 * Hook to initialize Ardor Synapse bridge
 *
 * @param options - Configuration options
 * @param options.enabled - Whether to enable synapse (default: true in development or when in iframe)
 * @param options.autoInit - Whether to initialize automatically (default: true)
 */
export function useArdorSynapse(options?: {
    enabled?: boolean;
    autoInit?: boolean;
}) {
    const { enabled, autoInit = true } = options || {};

    // Determine if synapse should be enabled
    const shouldEnable = enabled !== undefined
        ? enabled
        : import.meta.env.DEV || window.self !== window.top;

    useEffect(() => {
        if (!shouldEnable || !autoInit) {
            return;
        }

        // Initialize synapse
        synapse.init();

        // Cleanup on unmount
        return () => {
            synapse.destroy();
        };
    }, [shouldEnable, autoInit]);

    return {
        synapse,
        isEnabled: shouldEnable,
        isInitialized: synapse.isInitialized,
    };
}
