---
description: SAML-based authentication for larger companies
---

# Enterprise SSO

{% hint style="info" %}
This feature is currently available to orgs who have purchased $2000 USD or more in DeviceCloud credits.
{% endhint %}

Single sign-on solutions (such as OKTA) allow organisations to centrally manage user access to DeviceCloud.&#x20;

We support the following identity providers:

* Okta, Auth0
* Google Workspaces (formerly known as GSuite)
* Microsoft Active Directory, Azure Active Directory, Microsoft Entra
* PingIdentity
* OneLogin

Using a provider that is not on the list? Contact us and we'd be happy to help setup the integration.



#### Integration Steps

These steps have been written with OKTA in mind, but are applicable to other identity providers too.



1. &#x20;Create a new application with SAML in OKTA

![Select SAML 2.0 when creating a new app](https://mail.google.com/mail/u/0?ui=2\&ik=c2f7326118\&attid=0.2\&permmsgid=msg-a:r7654004608782227746\&th=1942d0e92629043e\&view=fimg\&fur=ip\&permmsgid=msg-a:r7654004608782227746\&sz=s0-l75-ft\&attbid=ANGjdJ9p6PSZiVK3E2K-IdRTLys8m3-UJqcPqECeO15OdLaLI3IHj1x1XEm3GsH0LhlTpCUxnBY6mQZDJQR0xFStP1acgRrEsBpQeico75WQdI-rDdOafhFl7-ZWAG8\&disp=emb\&realattid=ii_m0fbk91r0\&zw)

2. Populate the SAML fields using the below values.

<table><thead><tr><th width="255.06890869140625">key</th><th>value</th></tr></thead><tbody><tr><td>Single sign-on URL (ACS URL) </td><td>https://cloud.devicecloud.dev/auth/v1/sso/saml/acs</td></tr><tr><td>Audience URI (SP Entity ID)</td><td>https://cloud.devicecloud.dev/auth/v1/sso/saml/metadata</td></tr><tr><td>Default Relay State</td><td>https://cloud.devicecloud.dev/</td></tr></tbody></table>

3.  Ensure the application username is set to EMAIL\


    ![](https://mail.google.com/mail/u/0?ui=2\&ik=c2f7326118\&attid=0.1\&permmsgid=msg-a:r7654004608782227746\&th=1942d0e92629043e\&view=fimg\&fur=ip\&permmsgid=msg-a:r7654004608782227746\&sz=s0-l75-ft\&attbid=ANGjdJ9gKZSxFL_J0cUbAIweK-HIvqs8c1z2ifYKFn66SvZVflWixzj2LEPpukQwMbghnwRt0SNgTG5v9F-n56SZ1MplqseD6Zve6WFNIy1jj9mfjDFTylB-VawGkgU\&disp=emb\&realattid=ii_m0fbmkqg1\&zw)


4.  Ensure the Name ID Format is set also to EMAIL

    <figure><img src="../.gitbook/assets/Screenshot 2025-05-29 at 09.17.35.png" alt="" width="375"><figcaption></figcaption></figure>
5. Generate your metadata URL (or XML file for some providers)
6. Send the following to support@devicecloud.dev from an email address registered with DeviceCloud:
   1. your metadata URL (or XML)
   2. the email domain(s) you wish to protect
7. Our support team will then verify you have purchased the required amount of credits and enforce SSO for the requested domains.
8. Once activated, DeviceCloud supports Service Provider initiated login via SSO using the SSO button on the DeviceCloud login screen:

<figure><img src="../.gitbook/assets/Screenshot 2025-05-29 at 09.21.10.png" alt=""><figcaption></figcaption></figure>
