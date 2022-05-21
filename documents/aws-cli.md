### install aws-cli

```

// installation aws-cli
$ sudo apt-get install awscli   // for ubuntu
$ brew install awscli           // for mac

$ aws --version                 // installation check

// configuration
// first, find rootKey.csv in your download directory
// you need 'AccessKeyId' and 'AccessSecretKey'
$ aws configure
AWS Access Key ID [None]: paste from rootKey.csv
AWS Secret Access Key [None]: paste from rootKey.csv
Default region name [None]: ap-northeast-2
Default output format [None]: json

$ sudo nvim ~/.aws/credentials  // check accessKey and secretKey
$ aws ec2 describe-instances    // check connection with configKey


```
