Avoiding Common Attacks
=======================

1. Exposure: I structured the contracts to have a single user-interfacing contract with three supporting contracts that store state. The reason was to easily structure the contracts so that the supporting contracts can only be called by the master contract to limit function exposure.

2. Recursive calls: I included a circuit breaker to halt all state mutation in case of a re-entrancy attack.