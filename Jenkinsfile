pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/aibolitdata ./thinklabsdev/aibolitdataCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/aibolitdata \
                                    && docker service rm aibolitdata_web || true \
                                    && docker stack deploy -c ./thinklabsdev/aibolitdataCI/docker-compose.yml aibolitdata \
                                    && rm -rf ./thinklabsdev/aibolitdataCIB \
                                    && mv ./thinklabsdev/aibolitdataCI/ ./thinklabsdev/aibolitdataCIB",
                                execTimeout: 1800000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/aibolitdataCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, app/, server/, webpack/, uploads/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
            }
        }
    }
}
