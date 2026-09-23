import { delay, email, onEvent, path, workflow } from '@posthog/workflows'

export const welcome = workflow({
    // The identity of this workflow in the project. Every push resolves it, so keep it as it is.
    key: 'welcome',
    name: 'Welcome new signups',
    description: 'Waits half an hour after signup, then sends a welcome email.',
    on: onEvent({ event: 'user signed up' }),
    steps: path(
        delay('30m', { name: 'Wait half an hour' }),
        email({
            name: 'Send the welcome email',
            // The id of the project's verified email sender, listed under Workflows, Channels.
            from: { integrationIds: [1] },
            to: '{person.properties.email}',
            subject: 'Welcome aboard, {person.properties.first_name}',
            text: 'Thanks for signing up. Reply to this email if you get stuck.',
            html: '<p>Thanks for signing up. Reply to this email if you get stuck.</p>',
        })
    ),
    exit: { reason: 'Welcome finished' },
})
