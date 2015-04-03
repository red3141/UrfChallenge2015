# UrfChallenge2015

This is our entry in the Riot Games API Challenge.

## Configuration Setup

Copy `config.py.template` and save it as `config.py`. `config.py` will be
ignored by Git, so your configuration settings will not be published publicly.
Now edit `config.py` and enter the appropriate settings:

### Key

This is your Riot Development API Key. It is required for making API calls.

### DB

This is your MySQL database connection string. 

## Dependencies

You must have a MySQL instance running somewhere. You probably want to installed
MySQL on the same computer that is running the app.

You also need to install the MySQLdb package for python:
- Windows: [exe installer](http://sourceforge.net/projects/mysql-python/files/)
- Linux: `sudo apt-get install python-mysqldb`