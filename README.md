# Administration support issue ops

This repository is an issue ops automation that allows the support team of an organization to use Issue Ops to request 
temporarily admin access to the organization to perform tasks that require such permission. All the operations done during the process are reported as part of the audit log of the user. Closing the issue removes the permission.

## Automation

### Instructions

To request the permission:
- Open an issue using the template provided in this repository The fields are:
  - **Organization:** the name of the organization where you want to be promoted. See below the [list of supported organizations](#supported-organizations). 
  - **Description:** a description explaining why this request is raised is required. Write it in a single line 
  - **Ticket:** ID of the ticket in your support system
  - **Duration:** duration in hours. The minimum is 1 and the maximum is 8.
  - See below an example with a template filled in
    ```markdown
    Organization: my-org
    Description: A user requires to be added to a team and nobody else can give him access
    Ticket: 123456
    Duration: 2
    ```
- Fill in all the details but don't modify the template
- Once the issue is created an automation will trigger providing you with a temporary access to perform the tasks
- If you finish earlier than the time requested, close the issue to revoke your access immediately

⚠️ All the actions performed as an admin will be audited and added to the repository, so be cautious of the changes done in
the organization

> The duration requested will be approximate and has a ~1h error. We recommend to close the issue when the task is completed.

### Supported organizations

| Organization name | 
|-------------------|
| Add your supported organizations here |


## Setup

To setup this repository in your organization follow this steps:
- Create a `Personal Access Token` with the `admin:org` write permission of a machine account
- Add an actions secret called `PAT` in the repository containing the token. This token should have as permissions:
  - `admin:org`
  - `repo`
- Duplicate the `config.example.yml` file calling it `config.yml` and edit the parameters to match your needs

| Param name | Description |
|------------|-------------|
| org        | The name of the organization where this automation is located |
| repository | The name of the repository where this automation is located |
| supportedOrgs | The name of the organizations where the `PAT` provided can be used. As a minimum it should have the current org |
| reportPath | The name of the path where the automation will store and commit the reports. If you change this value should change it also in [the workflow `mkdir` command](./.github/workflows/manual-demotion-workflow.yml)

- Set a schedule for the cronjob on [`provisioning-check.yml`](./.github/workflows/provisioning-check.yml). The commented one is set to run every hour
- Enable actions in the repository

As this automation provides admin access to organizations, you may only want certain teams to be able to fill issues in. To do so:
- Enable branch protection rules so only certain people/automations can push to the repository
  - Restrict who can push to matching branches: add the bot
g- Set the permissions to this repository to `read` for the teams you want to be able to create issues to upgrade
- Make sure this repository is has `private` visibility and not `internal`, otherwise everyone in your org will be able to
create issues in it causing a security concern.
- Copy the contents from `.github/workflow-templates` to `.github/workflows` so you can start using the templates provided. You can modify them to your needs.

## Development

### CLI usage

Since testing this integration locally with actions is a bit difficult, we can run the actions as a CLI
for testing purposes. See the instructions of the CLI below:

```
$ npm start -- --help
Options:
  -v, --version                 Output the current version
  -t, --admin-token <string>    the token to access the API (mandatory)
  -a, --action <string>         the action to be executed
   
  action: parse-issue           Parse the body of an issue
  -i, --issue-number <number>   the issue number where we are executing the operation
   
  action: promote_demote        Promote user to admin or demote to member
  -u, --username <string>       the username to promote/demote
  -r, --role <string>           the role to apply on the username [admin | member]
   
  action: demotion_report       Parse the body of an issue
  -u, --username <string>       the username that was promoted/demoted
  -d, --description <string>    activity description
  -i, --issue-number <number>   the issue number where we are executing the operation
  -s, --ticket <number>         the ticket number in your support system
  -dd, --demotion-date <date>   demotion date example: 2021-03-12T10:36:36+00:00
  -pd, --promotion-date <date>  promotion date example: 2021-03-12T09:36:36+00:00
  -to, --target-org <date>      the target organization where the user was promoted
   
  -h, --help                    display help for command

```

### Integration setup

This integration requires a Personal Access Token with permissions in the orgs listed above. To use it, add the token as
an Actions Secret with the name `PAT`.

The integration is built on the following actions:
- admin-support-cli: This is a CLI that is used in the workflows to execute the operations
- (external) [action-add-labels@v1](https://github.com/actions-ecosystem/action-add-labels)
- (external) [action-remove-labels@v1](https://github.com/actions-ecosystem/action-remove-labels)
- (external) [github-script](https://github.com/actions/github-script)


### Adding new operations

The actions in the workflows are executed using a CLI. This CLI has different actions based on the names. The actions supported are:
- parse_issue
- check_auto_demotion
- demotion_report
- promote_demote

To develop new actions:
- Create a new command in the [`actions`](./admin-support-cli/src/commands/actions) folder
- Add the command to the [index file](./admin-support-cli/src/commands/actions/index.js) 
- Implement the `getName` and `execute` functions. You can optionally add new validations implementing the `validate` function.