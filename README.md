# lnqs.io

This is the source for [lnqs.io](https://lnqs.io/).
Since it's the idea of the site not to reveal it's purpose, I won't explain it here.
So head over and have a look at it yourself!

To avoid disclosure of all secrets of the site by publishing the source-code,
this repository only contains the framework. The actual modules providing the
content are managed in a git submodule in another, private repository.

These modules are AES-encrypted during the build-stage. The passphrases are generated
from user-input. While the usual debug-tools does give hints about the mechanics of the site,
it should be enough to prevent a simple look on the source from revealing too much.

If you're interested, just have a look at the project!
