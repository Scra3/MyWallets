# MyWallets

## Install dependencies
You should install android studio to use devices emulator.

``` bash
make install
```

## Run app

``` bash
make run
```

## Run tests

``` bash
make tests
```

## To show all available commands

``` bash
make
``` 

## Build release

``` bash
tns build android --release --key-store-path alban-bertolini.jks --key-store-password 'my_password' --key-store-alias MyWallets --key-store-alias-password 'my_password' --copy-to . --aab
``` 

### Tips

- If hot reloading does not work restart app.
- When you removed a css attribute, you probably should to set the attribute to none or 0 (it depends what you removed) because
the hot reloading modules does not watch on removed attributes.