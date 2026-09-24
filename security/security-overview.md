# Security Overview

As experienced engineers, we take security seriously and adopt industry standards wherever possible. If you have specific questions not covered by this document, please contact us via email - support@devicecloud.dev - we are happy to answer your security questionnaires.

### SOC2 Compliance Timeline

DeviceCloud has begun preparing and organising policies and controls that align with the SOC2 Type 1 compliance framework. The target compliance date is currently Q1 2027.

Want to work with DeviceCloud but require SOC2? Please contact us, we will fast-track this process if enough users request it.

### Infrastructure

DeviceCloud stores customer data and performs processing using Supabase and Railway. Uploaded files and test artefacts are stored in Supabase and Backblaze B2, and delivered through Cloudflare. These cloud platforms are SOC2 compliant. All test execution runs on DeviceCloud-owned hardware in our dedicated secure data centre in the UK.

### Data Encryption <a href="#data-encryption" id="data-encryption"></a>

Data held by our database and file storage providers is encrypted at rest with AES-256, and data sent over the internet is encrypted in transit via TLS. Credentials get additional protection at the application level: API keys are stored only as a one-way hash, and access tokens for connected services (such as Slack) are encrypted before being stored in the database.

For end-to-end protection of your uploads, run `dcd cloud` with `--encrypt` (or set `DCD_ENCRYPT=1`). The CLI then encrypts your app binary, flows and environment variables on your machine before they are uploaded, so the copies held in our storage and caches are encrypted.

### Data Retention <a href="#data-retention" id="data-retention"></a>

Uploads (both binaries and workflow files) are automatically deleted 1 month after last use; result data including maestro logs, screenshots and videos are retained for 6 months.

You can delete your account through the console UI or by contacting support. Deleting an account removes its records: any team where you are the only member is deleted along with its test runs, and you are removed from teams you share with others. Deleting a team from the console hides it and removes everyone's access immediately. To have a deleted team's data, or the stored files of a deleted account or team (app binaries, flows, screenshots and videos), permanently removed, email support@devicecloud.dev and our support team will purge them.

Android emulators are instantiated into a clean operating system instance for every test run. iOS simulators undertake an extensive teardown process to remove all cached data, but the underlying operating system persists due to Apple licensing requirements. Test artefacts are removed from the test runner as soon as the test is finished. To speed up repeat runs, each Mac runner keeps a small cache of recently used app binaries (the last 7), and our on-premises storage cache keeps recently used app binaries too; both evict older binaries automatically as new ones arrive. Binaries uploaded with `--encrypt` are only ever cached in encrypted form.

### Payments <a href="#payments" id="payments"></a>

DeviceCloud uses Paddle to handle payments. Paddle is PCI DSS SAQ A and SOC2 Type 1 compliant.

### Code Control <a href="#code-control" id="code-control"></a>

All code and configurations deployed inside DeviceCloud undergo a thorough code control process, which includes security considerations. All code is written or reviewed by UK-based employees.
