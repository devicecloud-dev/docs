---
description: SAML-based authentication for larger companies
---

# Enterprise Single Sign-On

{% hint style="info" %}
This feature is currently available to orgs who have purchased $1000 USD or more in DCD credits.
{% endhint %}

Single sign-on solutions (such as OKTA) allow organisations to centrally manage user access to DCD.&#x20;

We support the following identity providers:

* Google Workspaces (formerly known as GSuite)
* Okta, Auth0
* Microsoft Active Directory, Azure Active Directory, Microsoft Entra
* PingIdentity
* OneLogin

Using a provider that is not on the list? Contact us and we'd be happy to help setup the integration.



#### Integtation Steps

1. Email support@devicecloud.dev saying you'd like to set up enterprise SSO.
2. If you're eligible, we'll reply with the latest SAML settings (ACS URL, SP Entity ID, default relay state).
3. Use these values to configure a new SAML app in your Identity Provider's dashboard. **Important: ensure that the Name ID Format is set to Email Address.**
4. Send us your Metadata URL and required email domain(s) - we'll then add these into DCD auth config for your account.

