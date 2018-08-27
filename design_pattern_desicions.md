Design Patterns
===============

Unfortunately, I ran out of time on this project before completing many of the design patterns covered in the later modules. Given more time, here's what I would have implemented:

1. Circuit Breaker: In my master contract, I have the private boolean stopped and the modifier "stopInEmergency", that I use on all functions that affect state. This would be useful when/if new errors are discovered to halt state-mutating functions from taking place.