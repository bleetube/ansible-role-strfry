# Ansible Role: strfry

This Ansible Role builds and installs [strfry](https://github.com/hoytech/strfry), and also sets up [strfry-policies](https://gitlab.com/soapbox-pub/strfry-policies). It is intended to be composed with a separate role to handle the web proxy configuration.

Tested on:
* Archlinux
* Debian 11
* Ubuntu 22.04

## Requirements

None.

## Role Variables

```yaml
strfry_version: beta # git repository branch or release tag
strfry_make_jobs: "{{ ansible_processor_cores }}" # number of CPUs to build with
strfry_skip_config: no
strfry_policies_enabled: yes
```

See the role [defaults](defaults/main.yml).

If you are not using the `beta` branch/version, you should override the template with your own by enabling `strfry_skip_config` and managing the configuration manually.

```yaml
strfry_skip_config: yes
```

For more configuration info, see the relevant upstream [configuration example](https://github.com/hoytech/strfry/blob/beta/strfry.conf) for your branch/version.

## Example Playbook

```yaml
- hosts: strfry
  roles:
    - role: bleetube.strfry
    - role: nginxinc.nginx_core.nginx
      become: yes
  tasks:
    - import_tasks: nginx_conf.yml
      become: yes
```

A sample [nginx configuration](docs/examples/nginx_conf.yml) is provided.

For a fully functional production example that includes hosting multiple relays, see this [homelab stack](https://github.com/bleetube/satstack).

## Upgrades

Occasionally there are upgrades that require rebuilding the database. You need to `export` before upgrading, and then `import` with the new binary. The role might do the export step, but the import needs to be done manually. Don't rely on the role for the backup. Here's a simple example:

```shell
# Before upgrade
doas -u strfry strfry export > /tmp/backup.jsonl
# After upgrade
systemctl stop strfry
mv strfry-db/data.mdb strfry-db/backup.mdb
cat /tmp/backup.jsonl | doas -u strfry strfry import
doas -u strfry strfry compact strfry-db/compact.mdb
mv strfry-db/compact.mdb strfry-db/data.mdb
systemctl start strfry
```

This is by no means the cleanest way to upgrade, but you get the idea. It's possible to perform the import in a separate process (I think you'd just use a different config file) and then sync the two databases before performing a zero downtime restart.

## Troubleshooting

* If an upgrade fails to build, it could be due to previously built objects. A simple workaround is to delete the strfry source folder `~/src/strfry` and let it try to build from scratch.

* If `make` fails, try building on a single core:

  ```shell
  ansible-playbook playbooks/strfry/main.yml -e 'strfry_make_jobs=1'
  ```

* Reading your logs:

  ```shell
  systemctl status strfry
  journalctl -fu strfry
  ```

## Maintenance

* You should periodically run `compact` on your strfry database.

  ```shell
  systemctl stop strfry
  doas -u strfry strfry compact strfry-db/compact.mdb
  mv strfry-db/compact.mdb strfry-db/data.mdb
  systemctl start strfry
  ```

* You can prune events from the database, reducing it's size will reduce the overall compute load on the relay. Make a backup beforehand. Here is a simple example of deleting events that are more than 90 days old:

  ```shell
  doas -u strfry strfry export > /tmp/backup.jsonl
  doas -u strfry strfry delete --age=$((90 * 24 * 60 * 60))
  ```
  For a more advanced pruning strategy, you can implement an export/import process to remove certain kinds of events more aggresively. See [bleetube/strfry-prune](https://github.com/bleetube/strfry-prune) for an example.
  