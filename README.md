# Ansible Role: strfry

This Ansible Role builds and installs [strfry](https://github.com/hoytech/strfry). It is intended to be composed with a separate role to handle the web proxy configuration.

## Requirements

None.

## Role Variables

```yaml
strfry_version: beta # git repository branch or release tag
strfry_make_jobs: "{{ ansible_processor_cores }}" # number of CPUs to build with
strfry_skip_config: no
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
  become: yes
  roles:
    - role: bleetube.strfry
    - role: nginxinc.nginx_core.nginx
  tasks:
    - import_tasks: nginx_conf.yml
```

A sample [nginx configuration](docs/examples/nginx_conf.yml) is provided.

For a fully functional production example that includes hosting multiple relays, see this [homelab stack](https://github.com/bleetube/satstack).

## Troubleshooting
If `make` fails, try building on a single core:

```shell
ansible-playbook playbooks/strfry/main.yml -e 'strfry_make_jobs=1'
```

Logs

```shell
systemctl status strfry
journalctl -fu strfry
```

## Resources

Plugins:

* [strfry policies](https://gitlab.com/soapbox-pub/strfry-policies) plugin (deno) - recommended
* [strfry metrics](https://github.com/bleetube/strfry-plugin) (python)
* [spamblaster](https://github.com/relaytools/spamblaster) (go)