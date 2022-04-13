# Contributing

Contributions are appreciated! If you’d like to contribute, please help
us out by reading this short document.

## Before writing code

If you’re interested in adding a new feature, consider opening an issue
suggesting it. Then, we can discuss the feature to make sure that
everyone is on board.

If you’re interested in helping but don’t know where to start, consider
looking at open issues. [Issues marked **good first issue**][gfi]
may be especially accessible to newcomers. You can also [message us on
discord][invite].

[gfi]: https://github.com/coordinape/coordinape/issues?q=is%3Aissue+label%3A%22good+first+issue%22+is%3Aopen
[invite]: https://discord.gg/BgM8qdbrXK

If you find an issue that you’re interested in addressing, consider
adding a comment to that effect. This way, we can let you know if the
issue has gone stale before you put too much work into it, and other
contributors can know to focus on other issues.

## While writing code

### Semantically atomic commits

> for each desired change, make the change easy (warning: this may be
> hard), then make the easy change
>
> [—Kent Beck][kbeck-tweet]

[kbeck-tweet]: https://twitter.com/KentBeck/status/250733358307500032

We strive to factor our work into semantically atomic commits. Each commit
should represent a single semantic change, and the code included in the
commit should be the minimal amount of code required to implement, test,
and document that change.

For instance, perhaps you want to change the behavior of a component,
and along the way you find that it is useful to refactor a helper
function. In that case, you can create two commits: one to effect the
refactoring, and one to implement the change that has been made easy by
the refactoring.

This doesn’t mean that you have to physically write the code in this
order! The Git commit graph is malleable: you can write the code all at
once and commit it piecewise with `git add -p`; you can split and join
commits with interactive rebases; etc. What matters is the final
sequence of commits, not how you got there.

At the end of the day, you may find that you have a somewhat long
sequence of somewhat short changes. This is great. The goal is for a
reviewer to be able to say, “yep, this commit is obviously correct” as
many times in a row as are necessary for a full feature to be developed.

<details>
<summary><b>Why create small commits?</b></summary>

Writing small commits can help improve the design of your code. It is
common to realize an elegant way to split apart some functionality out
of a desire to split a commit into smaller, more localized pieces.

It is easier to review a commit that does one thing than a commit that
does many things. Not only will changes to the code be more localized,
but it will be easier for the reviewer to keep the whole context in
their mind.

Investigating and fixing bugs is much easier when commits are small.
There are more commits to look through, but an 8-fold increase in the
number of commits only entails 3 additional steps of bisection, which is
not a big deal. On the other hand, once the offending commit is
identified, the cause is more apparent if the commit is tiny than if it
is large.

</details>

### Checks

Each commit will need to pass all tests. Run `yarn test:ci`
to run them all. This will run:

- **TypeScript** (`yarn typecheck`). Your code must type-check with no errors or
  warnings. Using `any`-casts is permitted, but should be truly a last
  resort. You should put significant effort into avoiding every
  `any`-cast, especially in backend code.

- **Unit tests** (`yarn test`). You can also run `yarn test`
  to automatically re-run tests when you change a relevant file.

- **Prettier** (`prettier-check`). You can simply run `yarn prettify` to
  reformat all files. It can be convenient to set up your editor to
  run `yarn prettier --write CURRENT_FILENAME` whenever you save a
  file.

- **Lint** (`yarn lint`). You’ll have to fix lint errors manually.
  These are almost always unused imports or unused variables, and
  sometimes catch logic errors before unit tests do. Feel free to
  disable spurious lint errors on a per-line basis by inserting a
  preceding line with `// eslint-disable-next-line LINT_RULE_NAME`.

## When writing commit messages

### Summary of changes

Include a brief yet descriptive **summary** as the first line of the
message. The summary should be at most 50 characters, should be written
in the imperative mood, and should not include trailing punctuation. The
summary should either be in sentence case (i.e., the first letter of the
first word capitalized), or of the form “area: change description”. For
instance, all of the following are examples of good summaries:

- Improve error messages when GitHub query fails
- Make deploy script wait for valid response
- Upgrade Flow to v0.76.0
- new-webpack: replace old scripts in `package.json`
- fetchGithubRepo: remove vestigial data field

If you find that you can’t concisely explain your change in 50
characters, move non-essential information into the body of the commit
message. If it’s still difficult, you may be trying to change too much
at once!

<details>
<summary><b>Why include a summary?</b></summary>

The 50-character summary is critical because this is what Git
expects. Git often assumes that the first line of a commit contains a
concise description, and so workflows like interactive rebases surface
this information. The particular style of the summary is chosen to be
consistent with those commits emitted by Git itself: commands like
`git-revert` and `git-merge` are of this form, so it’s a good standard
to pick.

</details>

### Description

After the initial line, include a **description** of the change. Why is
the change important? Did you consider and reject alternate formulations
of the same idea? Are there relevant issues or discussions elsewhere? If
any of these questions provides valuable information, answer it.
Otherwise, feel free to leave it out—some changes really are
self-documenting, and there’s no need to add a vacuous description.

<details>
<summary><b>Why include a description?</b></summary>

A commit describes a _change_ from one state of the codebase to the
next. If your patch is good, the final state of the code will be clear
to anyone reading it. But this isn’t always sufficient to explain why
the change was necessary. Documenting the motivation, alternate
formulations, etc. is helpful both in the present (for reviewers) and in
the future (for people using `git-blame` to try to understand how a
piece of code came to be).

</details>

### Test plan

After the description, include a **test plan**. Describe what someone
should do to verify that your changes are correct. This can include
automated tests, manual tests, or tests of the form “verify that when
you change the code in this way, you see this effect.” Feel free to
include shell commands and expected outputs if helpful.

Sometimes, the test plan may appear trivial. It may be the case that you
only ran the standard unit tests, or that you didn’t feel that any
testing at all was necessary. In these cases, you should still include
the test plan: this signals to observers that the trivial steps are
indeed sufficient.

<details>
<summary><b>Why include a test plan?</b></summary>

The value of a test plan is many-fold. Simply writing the test plan can
force you to consider cases that you hadn’t before, in turn helping you
discover bugs or think of alternate implementations. Even if the test
plan is as simple as “standard unit tests suffice”, this indicates to
observers that no additional testing is required. The test plan is
useful for reviewers, and for anyone bisecting through the history or
trying to learn more about the development or intention of a commit.

</details>

### Wrapping

Wrap all parts of the commit message so that no line has more than **72
characters**.

<details>
<summary><b>Why wrap at 72 characters?</b></summary>

This leaves room for four spaces of padding on either side while still
fitting in an 80-character terminal. Programs like `git-log` expect that
this amount of padding exists.

(Yes, people really still use 80-character terminals. When each of your
terminals has bounded width, you can display more of them on a screen!)

</details>

# Code Reviews

## Pull Requests
We use Pull Requests in Github to collect a series of commits into one changeset that can be reviewed, tested, and merged into our `main` git branch.
Community open source contributors must make Pull Requests from their fork of the `coordinape` git repo into the main git repo, for security reasons. A code reviewer will then review the PR, and approve running our CI and Vercel pre-deployment checks against this changeset.


<details>
<summary><b>Community open source PR example:</b></summary>

In this example, 31 commits are included in a PR from a forked git repo into the primary `coordinape` git repo's `main` branch.

<img width="838" alt="community contributor git branch example image" src="https://user-images.githubusercontent.com/83605543/163241956-8c36386f-34a5-4b65-b1e3-f5091ad0684e.png">

</details>

<details>
<summary><b>Core contributor PR example:</b></summary>

In this example, 34 commits are included in a PR from a git branch into the `main` branch, all within the primary `coordinape` git repo.

<img width="842" alt="core contributor git branch example image" src="https://user-images.githubusercontent.com/83605543/163243280-ea69c8dc-d87c-4fc0-a66e-4220de66ea65.png">

</details>

### PR Guidelines

- A set of one or more commits should be grouped into a PR around one specific change.
- Ideally, we have more, smaller PRs, which enables easier code reivew, and safer deployments. However, helper function refactors can be included in the same PR as the change that uses the helper function, for example.
- The PRs description should clearly indicate what changes are happening, or link to the issue the PR addresses.
- A PRs should include how to manually (and automatedly) test the feature changes of the PR.
- PRs description should include images/videos of the change, if applicable.



Coordinape has code owners assigned to various parts of the codebase who
will be auto-assigned as reviewers to your PR. If you are keen to get your
code looked at, you are encouraged to @ them on GitHub and/or Discord.
We will appreciate your enthusiasm!
