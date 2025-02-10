# Runner Type

{% hint style="info" %}
Runner Type is currently an experimental feature
{% endhint %}

By default each test run uses the following underlying  hardware specifications:

<table><thead><tr><th width="156">Runner Type</th><th>Platform</th><th>Host OS</th><th>Architecture</th><th>RAM</th><th>CPU Cores</th></tr></thead><tbody><tr><td><code>default</code></td><td>iOS</td><td>MacOS</td><td>M1</td><td>8 GB</td><td>8</td></tr><tr><td><code>default</code></td><td>Android</td><td>Ubuntu</td><td>x86</td><td>12 GB</td><td>12</td></tr></tbody></table>



As modern simulators and emulators are becoming more resource intensive, DeviceCloud is gradually rolling out additional runner types to support more advances/intensive test scenarios.

If your app or test is struggling with the default runner types, you can try the options below. Note: non-default runner types are charged at the advanced run fee as per [pricing](https://devicecloud.dev/#pricing).

Opt-in to non-default runner types using CLI flag:&#x20;

`dcd cloud ... --runner-type=m1-android`



<table><thead><tr><th width="163">Runner Type</th><th width="116">Platform</th><th width="115">Host OS</th><th width="138">Architecture</th><th width="117">RAM</th><th>CPU Cores</th></tr></thead><tbody><tr><td><code>m1-android</code></td><td>Android</td><td>MacOS</td><td>M1</td><td>8 GB</td><td>12</td></tr></tbody></table>

