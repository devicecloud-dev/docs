---
description: "How people sign in to the DeviceCloud console and CLI: sign-in methods, two-factor authentication, passkeys, team sign-in requirements, and how long sessions last."
---

# Sign-in & Sessions

## Sign-in and two-factor authentication

You can sign in to the console with an email code, GitHub, Google or a passkey. With [Enterprise SSO](enterprise-single-sign-on.md), you sign in through your identity provider instead.

In **Settings → Account**, each person can add:

* **Two-factor authentication**: a code from an authenticator app, asked for each time you sign in. A passkey counts as two-factor, so after a passkey the code is only asked for if you turn on **Also ask for a code after signing in with a passkey**.
* **Passkeys**: sign in with your fingerprint, face, screen lock or a security key. Once you have a passkey, you must use it every time you sign in. An email code, GitHub or Google alone is no longer enough.

Owners and admins can set a team **Sign-in requirement** in **Settings → Team**:

| Option | Members must sign in with |
| --- | --- |
| Off | Any method |
| Two-factor | A passkey, or a code from an authenticator app |
| A passkey | A passkey |
| A passkey and a code | A passkey, then a code from an authenticator app |

A member who hasn't signed in that way still sees the team listed, but can't open its results, uploads or settings until they do. This applies to `dcd login` sessions too: run `dcd login` again with a method that meets the requirement. Any SSO sign-in meets every option. API keys aren't affected.

## Sessions

Signing in to the console, or with `dcd login`, starts a session. A session ends 30 days after you sign in, or after 7 days without use, whichever comes first, and you then sign in again. An open console tab counts as use. The limits are checked when the session renews, which happens about once an hour, so a session can last up to an hour past them.

You can see your sessions in the console under **Settings → Account → Active sessions**, sign out a single device, or sign out of all devices at once. API keys are not sessions, so these limits don't apply to them.
