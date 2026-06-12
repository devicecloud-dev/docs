---
description: SAML-based authentication for larger companies
---

# Enterprise SSO



{% hint style="info" %}
This feature is currently available to orgs who have the Max subscription or above.
{% endhint %}

Single sign-on solutions (such as OKTA) allow organisations to centrally manage user access to DeviceCloud.

We support the following identity providers:

* Okta, Auth0
* Google Workspaces (formerly known as GSuite)
* Microsoft Active Directory, Azure Active Directory, Microsoft Entra
* PingIdentity
* OneLogin

Using a provider that is not on the list? Contact us and we'd be happy to help setup the integration.

#### Integration Steps

These steps have been written with OKTA in mind, but are applicable to other identity providers too.

1. Create a new application with SAML in OKTA
2. Populate the SAML fields using the below values.

| Key                          | Value                                                     |
| ---------------------------- | --------------------------------------------------------- |
| Single sign-on URL (ACS URL) | `https://cloud.devicecloud.dev/auth/v1/sso/saml/acs`      |
| Audience URI (SP Entity ID)  | `https://cloud.devicecloud.dev/auth/v1/sso/saml/metadata` |
| Default Relay State          | `https://cloud.devicecloud.dev/`                          |

3. Ensure the application username is set to EMAIL
4. Ensure the Name ID Format is set also to EMAIL
5. Generate your metadata URL (or XML file for some providers)
6. Send the following to support@devicecloud.dev from an email address registered with DeviceCloud:
   1. your metadata URL (or XML)
   2. the email domain(s) you wish to protect
7. Our support team will then verify you have purchased the required amount of credits and enforce SSO for the requested domains.
8. Once activated, DeviceCloud supports Service Provider initiated login via SSO using the SSO button on the DeviceCloud login screen:

<figure><img src="../.gitbook/assets/Screenshot 2025-05-29 at 09.21.10.png" alt=""><figcaption></figcaption></figure>
