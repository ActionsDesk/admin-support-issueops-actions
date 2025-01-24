# Administration Support IssueOps

This repository contains automation that allows the support team of an
organization to use [IssueOps](https://issue-ops.github.io/docs/) to request
temporary elevation of their access to perform tasks that require administrative
permission. All the operations done during the process are reported as part of
the audit log of the user. Closing the issue removes the permission.

## Setup

To use this action in your own organization(s), follow the below steps:

1. Create a
   [Personal Access Token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
   with `admin:org` and `repo` write permissions

   > [!NOTE]
   >
   > It is **highly** recommended to use a machine user for this purpose, not a
   > personal account.

1. Clone this repository into your organization
1. In your cloned repository, create a
   [GitHub Actions secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)
   named `PAT` using the token you created previously
1. Uncomment the `on` properties in the following workflow files:
   - [`check-workflow.yml`](./.github/workflows/check-workflow.yml)
   - [`demotion-workflow.yml`](./.github/workflows/demotion-workflow.yml)
   - [`promotion-workflow.yml`](./.github/workflows/promotion-workflow.yml)
1. Update the `ALLOWED_ORGS` environment variable in the following workflow
   files:

   - [`check-workflow.yml`](./.github/workflows/check-workflow.yml)
   - [`demotion-workflow.yml`](./.github/workflows/demotion-workflow.yml)
   - [`promotion-workflow.yml`](./.github/workflows/promotion-workflow.yml)

   This should be see to a comma-separated list of the organizations where you
   want to allow to use this automation (and the `PAT` you created can acess)

   ```yaml
   env:
     ALLOWED_ORGS: 'octo-org,octo-org2'
   ```

1. Commit and push the changes to your repository
1. [Enable GitHub Actions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
   in the repository

   As this automation provides admin access to organizations, you may only want
   certain teams to be able to fill issues in.

1. Enable
   [repositorty rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
   so only certain users can access the repository
1. Grant `read` permission to any users or teams who will need to be able to
   create issues in the repository
1. Set the repository visibility to `private`, not `internal`

## Automation

To request the permission:

1. Open an issue using the
   [template](https://github.com/ActionsDesk/admin-support-issueops-actions/issues/new?template=request_admin_permission.yml)
   provided in this repository

   | Field        | Description                                       |
   | ------------ | ------------------------------------------------- |
   | Organization | Organization where you want to be promoted        |
   | Description  | Expanation of why this request is being submitted |
   | Ticket       | ID of a related ticket in your support system     |
   | Duration     | Duration in hours that you need the permission    |

   The completed form will look like the following:

   ```markdown
   ### Organization

   octo-org

   ### Description

   A user requires to be added to a team and nobody else can give him access

   ### Ticket

   1234

   ### Duration

   1
   ```

1. Once the issue is created, a GitHub Actions workflow will trigger providing
   you with temporary access to perform your task(s)
1. Once you have completed your task(s), close the issue to revoke your access
   automatically
1. All the actions performed as an admin will be audited and added to the
   repository, so be cautious of the changes done in the organization

> [!IMPORTANT]
>
> The duration requested will be approximate and has a ~1h error. We recommend
> to close the issue when the task is completed.

## Development

### CLI Usage

The [`@github/local-action`](https://github.com/github/local-action) utility can
be used to test your action locally. It is a simple command-line tool that
"stubs" (or simulates) the GitHub Actions Toolkit. This way, you can run your
action locally without having to commit and push your changes to a repository.

The `local-action` utility can be run in the following ways:

- Visual Studio Code Debugger

  Make sure to review and, if needed, update
  [`.vscode/launch.json`](./.vscode/launch.json)

- Terminal/Command Prompt

  ```bash
  cd admin-support-cli

  # npx local-action <action-yaml-path> <entrypoint> <dotenv-file>
  npx local-action . src/main.ts .env
  ```

You can provide a `.env` file to the `local-action` CLI to set environment
variables used by the GitHub Actions Toolkit. For example, setting inputs and
event payload data used by your action. For more information, see the example
file, [`.env.example`](./admin-support-cli/.env.example), and the
[GitHub Actions Documentation](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables).

Additionally, this `local-action` CLI can make use of mock webhook payloads. You
can provide a JSON file path for the `GITHUB_EVENT_PATH` environment variable in
the `.env` file. For a minimal example that can be used with this action, see
[`issue_payload.example.json`](./admin-support-cli/issue_payload.example.json).
