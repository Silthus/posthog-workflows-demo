// @posthog/workflows cannot express everything in this workflow. Review these before you push:
// - This workflow has no key, so the copied file invents one from its name. The first push creates a new draft workflow. Turn the original workflow off or delete it after that push.

import { delay, fn, onEvent, path, workflow } from '@posthog/workflows'

export const pageviewWebhookPing = workflow({
    key: 'pageview-webhook-ping',
    name: 'Pageview webhook ping',
    on: onEvent({
        event: '$pageview',
        description: 'User performs an action to start the workflow.',
    }),
    steps: path(
        delay('10m', {
            name: 'Delay',
            description: 'Wait for 10 minutes.',
            id: 'action_delay_4706ff60-3ccb-41df-b42a-eed3d1f10d8e',
        }),
        fn({
            name: 'Webhook',
            description: 'Send a Webhook to the user.',
            id: 'action_function_c6c63eb2-efa5-4aa7-ae5b-a30ec00d952d',
            templateId: 'template-webhook',
            inputs: {
                url: 'http://localhost:2080/workflows-demo',
                body: { event: '{event}', person: '{person}' },
                debug: false,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            },
        }),
    ),
    exit: {
        reason: 'Default exit',
        description: 'User moved through the workflow without errors.',
    },
})
