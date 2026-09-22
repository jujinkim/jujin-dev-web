# Blue-green

Switch traffic; preserve data history.

ID: blue-green
Language: en
Revision: 2
Translation source revision: 2
Canonical: https://kickoff.jujin.dev/en/catalog/blue-green/

## Why: the goal or problem

Replacing the live environment in place complicates a quick return. You need to verify a replacement before routing users to it.

## How: work toward a solution

Blue v1 starts with all traffic; green v2 waits. Next verifies green before switching traffic. Fail verification prevents the switch. After switching, Save A17 writes shared compatible data. Simulate failure and switch back routes traffic to blue; A17 remains. Previous revisits routing stages without erasing writes. Reset or reload clears the entire page-memory simulation.

## What: the concept

Blue-green deployment prepares two environments and changes which receives live traffic. Reversing that route does not undo database writes.

Plan data compatibility and recovery separately.

[Source](https://martinfowler.com/bliki/BlueGreenDeployment.html)
