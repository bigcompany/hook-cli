# UNRELEASED / WORK IN PROGRESS

# hook-cli

Command Line Interface for an awaiting hook-server, like [hook.io](http://hook.io).

# Installation

This library can be installed by installing the hook.io-sdk.

    npm install hook.io -g
    
You can also install the tool directly by running

    npm install hook-cli -g
    
Either of these commands will make the `hook` binary globally available on your local system.


# Usage

The `hook` binary has several usage options.

### Running a built-in command

    hook [command] [options]

### Running a hook file directly
    
    hook [file] [options]

### Unix Pipes

The `hook` binary is fully capable of receiving and sending data through standard unix pipes.

    echo "hello" | hook echo | echo $1

## Commands

### hook init

Initializes / creates a new Hook locally. Will prompt you for information related to creating the Hook.

### hook push

Pushes the current working hook to an awaiting `hook-server`, like [hook.io](http://hook.io)

### hook pull

Pulls the current version of the hook from an awaiting `hook-server`, like [hook.io](http://hook.io)

### hook run

Runs the current working Hook. Will prompt for parameters if a schema is present. Will treat STDIN / STDOUT as HTTP request and response streams.

### hook test

Tests the current working Hook.