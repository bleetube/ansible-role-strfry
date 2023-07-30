# Ansible Role: strfry

This Ansible Role builds and installs [strfry](https://github.com/hoytech/strfry).

Future role improvements:

* The git tasks in this role are not yet idempotent due to handling a submodule.
* The installation process could be made to check if strfry is already running and perform a zero-downtime upgrade.

## Requirements

None.

## Role Variables

```yaml
strfry_version: beta # git repository branch or release tag
strfry_make_jobs: "{{ ansible_processor_cores }}" # number of CPUs to build with
strfry_skip_config: False
```

See `defaults/main.yml`

If you are not using the `beta` branch/version, you should override the template with your own by setting `strfry_skip_config` to true and manage the configuration manually.

For more configuration info, see the relevant upstream [configuration example](https://github.com/hoytech/strfry/blob/beta/strfry.conf) for your branch/version.

## Example Playbook

```yaml
- hosts: all
  become: true
  roles:
    - role: bleetube.strfry
    - role: nginxinc.nginx_core.nginx
  tasks:
    - import_tasks: nginx_conf.yml
```

## Troubleshooting

If `make` fails, try running on a single core:

```shell
ansible-playbook playbooks/strfry/main.yml -e 'strfry_make_jobs=1'
```
