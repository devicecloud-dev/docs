# Security Overview

As experienced engineers, we take security seriously and adopt industry standards wherever possible. If you have specific questions not covered by this document, please contact us via email - support@devicecloud.dev - we are happy to answer your security questionnaires.

### Security Leadership <a href="#security-leadership" id="security-leadership"></a>

Security at DeviceCloud is led by **Tom Riglar, co-founder**. He is accountable for our security programme, including vulnerability management, security testing of our own platform, and incident response.

### Reporting a Vulnerability <a href="#reporting-a-vulnerability" id="reporting-a-vulnerability"></a>

If you think you have found a security issue in DeviceCloud, please email support@devicecloud.dev with "Security" in the subject line. Include enough detail for us to reproduce it. Please give us a reasonable chance to fix the issue before you share it with anyone else. Our contact details are also published at [devicecloud.dev/.well-known/security.txt](https://devicecloud.dev/.well-known/security.txt).

### SOC2 Compliance Timeline

DeviceCloud has begun preparing and organising policies and controls that align with the SOC2 Type 1 compliance framework. The target compliance date is currently Q1 2027.

Want to work with DeviceCloud but require SOC2? Please contact us, we will fast-track this process if enough users request it.

### Infrastructure

DeviceCloud stores customer data and performs processing using Supabase and Railway. Uploaded files and test artefacts are stored in Supabase and Backblaze B2, and delivered through Cloudflare. These cloud platforms are SOC2 compliant. All test execution runs on DeviceCloud-owned hardware in our dedicated secure data centre in the UK.

### Data Encryption <a href="#data-encryption" id="data-encryption"></a>

Data held by our database and file storage providers is encrypted at rest with AES-256, and data sent over the internet is encrypted in transit via TLS. Credentials get additional protection at the application level: API keys are stored only as a one-way hash, and access tokens for connected services (such as Slack) are encrypted before being stored in the database.

On top of TLS, your uploads get envelope encryption by default. Before anything is uploaded, the CLI encrypts your app binary, flows and environment variables on your machine, each with its own random key (AES-256-GCM). It then encrypts each of those keys with DeviceCloud's public key (X25519), so the copies held in our storage and caches are ciphertext, and only our API can recover the keys that decrypt them. To turn envelope encryption off, pass `--no-encrypt` or set `DCD_ENCRYPT=0`. The upload is still encrypted in transit.

### Sessions

Signing in to the console, or with `dcd login`, starts a session. A session ends 30 days after you sign in, or after 7 days without use, whichever comes first, and you then sign in again. An open console tab counts as use. The limits are checked when the session renews, which happens about once an hour, so a session can last up to an hour past them.

You can see your sessions in the console under **Settings → Account → Active sessions**, sign out a single device, or sign out of all devices at once. API keys are not sessions, so these limits don't apply to them.

### Data Retention <a href="#data-retention" id="data-retention"></a>

Uploads (both binaries and workflow files) are automatically deleted 1 month after last use; result data including maestro logs, screenshots, videos and the environment variables passed with `--env` are retained for 6 months. Our database backups are kept for at most 6 months, so a backup copy of this data is gone at most 6 months after it is deleted.

You can delete your account through the console UI or by contacting support. Deleting an account removes its records: any team where you are the only member is deleted along with its test runs, and you are removed from teams you share with others. Deleting a team from the console hides it and removes everyone's access immediately. To have a deleted team's data, or the stored files of a deleted account or team (app binaries, flows, screenshots and videos), permanently removed, email support@devicecloud.dev and our support team will purge them.

Android emulators are instantiated into a clean operating system instance for every test run. iOS simulators undertake an extensive teardown process to remove all cached data, but the underlying operating system persists due to Apple licensing requirements. Test artefacts are removed from the test runner as soon as the test is finished. To speed up repeat runs, each Mac runner keeps a small cache of recently used app binaries (the last 7), and our on-premises storage cache keeps recently used app binaries too; both evict older binaries automatically as new ones arrive. Encrypted binaries are only ever cached in encrypted form.

### Payments <a href="#payments" id="payments"></a>

DeviceCloud uses Paddle to handle payments. Paddle is PCI DSS SAQ A and SOC2 Type 1 compliant.

### Code Control <a href="#code-control" id="code-control"></a>

All code and configurations deployed inside DeviceCloud undergo a thorough code control process, which includes security considerations. All code is written or reviewed by UK-based employees.
