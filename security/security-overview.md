# Security Overview

As experienced engineers, we take security seriously and adopt industry standards wherever possible. If you have specific questions not covered by this document, please contact us via email - support@devicecloud.dev - we are happy to answer your security questionnaires.

### Security Leadership <a href="#security-leadership" id="security-leadership"></a>

Security at DeviceCloud is led by **Tom Riglar, co-founder**. He is accountable for our security programme, including vulnerability management, security testing of our own platform, and incident response.

### Reporting a Vulnerability <a href="#reporting-a-vulnerability" id="reporting-a-vulnerability"></a>

If you think you have found a security issue in DeviceCloud, please email [security@devicecloud.dev](mailto:security@devicecloud.dev). Include enough detail for us to reproduce it. Please give us a reasonable chance to fix the issue before you share it with anyone else. Our contact details are also published at [devicecloud.dev/.well-known/security.txt](https://devicecloud.dev/.well-known/security.txt).

### SOC2 Compliance Timeline

DeviceCloud has begun preparing and organising policies and controls that align with the SOC2 Type 1 compliance framework. The target compliance date is currently Q1 2027.

Want to work with DeviceCloud but require SOC2? Please contact us, we will fast-track this process if enough users request it.

### Infrastructure

DeviceCloud stores customer data in Supabase (database and file storage) and Backblaze B2 (file storage). Our API runs on Railway. The console, and the files you download, are delivered through Cloudflare. Application logs are kept in Axiom. These cloud platforms are SOC2 compliant. All test execution runs on DeviceCloud-owned hardware in our dedicated secure data centre in the UK.

Where your data is held:

| Data | Provider and location |
| --- | --- |
| Accounts, teams, test results and settings | Supabase, AWS London (UK) |
| App binaries, flows, screenshots, videos and logs | Supabase Storage, AWS London (UK), and Backblaze B2, Amsterdam (EU) |
| Application logs | Axiom, AWS Frankfurt (EU) |
| API servers | Railway, in the Netherlands, US East, US West and Singapore. Your requests go to the nearest one. |
| Test devices | DeviceCloud-owned hardware in the UK |

### Data Encryption <a href="#data-encryption" id="data-encryption"></a>

Data held by our database and file storage providers is encrypted at rest with AES-256, and data sent over the internet is encrypted in transit via TLS. Credentials get additional protection at the application level: API keys are stored only as a one-way hash, and webhook secrets and access tokens for connected services (such as Slack) are encrypted before being stored in the database.

On top of TLS, your uploads get envelope encryption by default. Before anything is uploaded, the CLI encrypts your app binary, flows and environment variables on your machine, each with its own random key (AES-256-GCM). It then encrypts each of those keys with DeviceCloud's public key (X25519), so the copies held in our storage and caches are ciphertext, and only our API can recover the keys that decrypt them. To turn envelope encryption off, pass `--no-encrypt` or set `DCD_ENCRYPT=0`. The upload is still encrypted in transit.

### Sign-in and two-factor authentication

You can sign in to the console with an email code, GitHub, Google or a passkey. With [Enterprise SSO](enterprise-single-sign-on.md), you sign in through your identity provider instead.

In **Settings → Account**, each person can add:

* **Two-factor authentication**: a code from an authenticator app, asked for each time you sign in with an email code, GitHub or Google. A passkey already counts as two-factor, so the code isn't asked for after a passkey unless you turn on **Also ask for a code after signing in with a passkey**.
* **Passkeys**: sign in with your fingerprint, face, screen lock or a security key instead of an email code.

Owners and admins can set a team **Sign-in requirement** in **Settings → Team**:

| Option | Members must sign in with |
| --- | --- |
| Off | Any method |
| Two-factor | A passkey, or a code from an authenticator app |
| A passkey | A passkey |
| A passkey and a code | A passkey, then a code from an authenticator app |

A member who hasn't signed in that way still sees the team listed, but can't open its results, uploads or settings until they do. This applies to `dcd login` sessions too: run `dcd login` again with a method that meets the requirement. Any SSO sign-in meets every option. API keys aren't affected.

### Sessions

Signing in to the console, or with `dcd login`, starts a session. A session ends 30 days after you sign in, or after 7 days without use, whichever comes first, and you then sign in again. An open console tab counts as use. The limits are checked when the session renews, which happens about once an hour, so a session can last up to an hour past them.

You can see your sessions in the console under **Settings → Account → Active sessions**, sign out a single device, or sign out of all devices at once. API keys are not sessions, so these limits don't apply to them.

### Data Retention <a href="#data-retention" id="data-retention"></a>

Uploads (both binaries and workflow files) are automatically deleted 1 month after last use; result data including maestro logs, screenshots, videos and the environment variables passed with `--env` are retained for 6 months. Our database backups are kept for at most 6 months, so a backup copy of this data is gone at most 6 months after it is deleted.

You can delete your account through the console UI or by contacting support. Deleting an account removes its records: any team where you are the only member is deleted along with its test runs, and you are removed from teams you share with others. Deleting a team from the console hides it and removes everyone's access immediately. To have a deleted team's data, or the stored files of a deleted account or team (app binaries, flows, screenshots and videos), permanently removed, email support@devicecloud.dev and our support team will purge them.

Android emulators are instantiated into a clean operating system instance for every test run. iOS simulators undertake an extensive teardown process to remove all cached data, but the underlying operating system persists due to Apple licensing requirements. Test artefacts are removed from the test runner as soon as the test is finished. To speed up repeat runs, each Mac runner keeps a small cache of recently used app binaries (the last 7), and our on-premises storage cache keeps recently used app binaries too; both evict older binaries automatically as new ones arrive. Encrypted binaries are only ever cached in encrypted form.

### Payments <a href="#payments" id="payments"></a>

DeviceCloud uses Paddle, our Merchant of Record, to handle payments. You enter card details in Paddle's checkout, so they never reach DeviceCloud's servers.

### Code Control <a href="#code-control" id="code-control"></a>

All code and configurations deployed inside DeviceCloud undergo a thorough code control process, which includes security considerations. All code is written or reviewed by UK-based employees.
