# Runner Type

{% hint style="info" %}
Runner Type is currently an experimental feature
{% endhint %}

By default each test run uses the following underlying hardware specifications:

<table><thead><tr><th width="156">Runner Type</th><th>Platform</th><th>Host OS</th><th>Architecture</th><th>RAM</th><th>CPU Cores</th></tr></thead><tbody><tr><td><code>default</code></td><td>iOS</td><td>MacOS</td><td>M1</td><td>8 GB</td><td>8</td></tr><tr><td><code>cpu1</code></td><td>Android</td><td>Ubuntu</td><td>x86</td><td>12 GB</td><td>12</td></tr></tbody></table>



As modern simulators and emulators are becoming more resource intensive, DeviceCloud is gradually rolling out additional runner types to support more advanced/intensive test scenarios.

If your app or test is struggling with the default runner types, you can try the options below. Note: non-default runner types are charged at the advanced run fee as per [pricing](https://devicecloud.dev/#pricing).

Opt-in to non-default runner types using CLI flag:&#x20;

`dcd cloud ... --runner-type=m4`



<table><thead><tr><th width="163">Runner Type</th><th width="116">Platform</th><th width="115">Host OS</th><th width="138">Architecture</th><th width="117">RAM</th><th>CPU Cores</th><th>Notes</th></tr></thead><tbody><tr><td><code>m4</code></td><td>iOS</td><td>MacOS</td><td>M4</td><td>16 GB</td><td>10</td><td></td></tr><tr><td><code>m1</code></td><td>Android</td><td>MacOS</td><td>M1</td><td>8 GB</td><td>8</td><td>Limited capacity. Used for debugging hostOS issues on Android.</td></tr><tr><td><code>gpu1</code></td><td>Android</td><td>Ubuntu</td><td>x86</td><td>16 GB</td><td>5</td><td>Additional GPU acceleration also provided.</td></tr></tbody></table>

