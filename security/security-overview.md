# Security Overview

As experienced engineers, we take security seriously and adopt industry standards wherever possible. If you have specific questions not covered by this document, please contact us via email - support@devicecloud.dev - we are happy to answer your security questionnaires.&#x20;

### SOC2 Compliance Timeline

DeviceCloud has begun preparing and organising policies and controls that align with the SOC2 Type 1 compliance framework. The target compliance date is currently Q3 2026.

Want to work with DeviceCloud but require SOC2? Please contact us, we will fast-track this process if enough users request it.&#x20;

### Infrastructure

DeviceCloud stores customer data and performs processing using Supabase and Railway. These cloud platforms are SOC2 compliant. Some test execution is done using our dedicated secure data centre in the UK.

### Data Encryption <a href="#data-encryption" id="data-encryption"></a>

All user data is encrypted at rest with AES-256 and in transit via TLS. Additionally, sensitive information such as access tokens and keys is encrypted at the application level before being stored in the database.

### Data Retention <a href="#data-encryption" id="data-encryption"></a>

Uploads (both binaries and workflow files) are automatically deleted 2 months after last use; result data including maestro logs, screenshots and videos are retained for 12 months. All account data is permanently deleted when you request account deletion. This can be done by contacting support.

Android emulators are instantiated into a clean operating system instance for every test run. iOS simulators undertake an extensive teardown process to remove all cached data, but the underlying operating system persists due to Apple licensing requirements. All customer test data is completely removed from the test runner as soon as the test is finished.

### Payments <a href="#payments" id="payments"></a>

DeviceCloud uses Paddle to handle payments. Paddle is PCI DSS SAQ A and SOC2 Type 1 compliant.

### Code Control <a href="#payments" id="payments"></a>

All code and configurations deployed inside DeviceCloud undergo a thorough code control process, which includes security considerations. All code is authored by UK-based employees.





