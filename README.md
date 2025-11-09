# cftop

Terminal UI for viewing and monitoring Cloudflare Workers (and related tools) from your terminal

## Installation

Install via the shell script:

```
curl -fsSL https://raw.githubusercontent.com/NWBY/cftop/refs/heads/main/install.sh | sh
```

## Upgrading

To upgrade to the latest version you can simply run the install command above.

## Setup

To use `cftop` you will need two things:

1. Your account ID
2. A user API token with the following permissions:
   - Workers Agents Configuration:Read
   - Workers Observability:Edit
   - Workers Observability:Read
   - Workers R2 Storage:Read
   - Workers Tail:Read
   - Workers Scripts:Read
   - Account Analytics:Read

Once you've got your account ID and API token you need to initialise the config file:

```
cftop init --apiToken=<api-token> --accountId=<acccount-id>
```

Once initialisation is complete you can run: `cftop`

## Keybindings

| Key     | Action                                                          |
| ------- | --------------------------------------------------------------- |
| `q`     | Quit cftop                                                      |
| `h`     | Go to the home view (default view)                              |
| `w`     | Focus on the workers box                                        |
| `d`     | Focus on the durable objects box                                |
| `b`     | Focus on the R2 buckets box                                     |
| `tab`   | Switch focus to next box                                        |
| `up`    | Select previous item in list                                    |
| `down`  | Select next item in list                                        |
| `enter` | Select to view details (only for viewing Worker and R2 details) |
