pipeline {
    agent any
    environment {
        //be sure to replace "enyushih226" with your own Docker Hub username
        DOCKER_IMAGE_NAME = "enyushih226/mythicalmysfits-service"
        CANARY_REPLICAS = 0
    }
    stages {

        stage('Build Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    app = docker.build(DOCKER_IMAGE_NAME)
                }
            }
        }
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub_login') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        stage('CanaryDeploy') {
            when {
                branch 'master'
            }
            environment { 
                CANARY_REPLICAS = 1
            }
            steps {
                kubernetesDeploy(
                    kubeconfigId: 'kubeconfig',
                    configs: 'mythicalmysfits-kube-canary.yml',
                    enableConfigSubstitution: true
                )
            }
        }
        stage('Sanity Test') {
            when {
                branch 'master'
            }
            steps {
                script {
                    sleep (time: 5)
                    def response = httpRequest (
                        url: "http://$KUBE_WORKER_NODE_IP:8081/",
                        timeout: 30
                    )
                    if (response.status != 200) {
                        error("Sanity test against canary deployment failed.")
                    }
                }
            }
        }
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                milestone(1)
                kubernetesDeploy(
                    kubeconfigId: 'kubeconfig',
                    configs: 'mythicalmysfits-kube.yml',
                    enableConfigSubstitution: true
                    )
               }
            }
        }
        post {
            cleanup {
                kubernetesDeploy (
                    kubeconfigId: 'kubeconfig',
                    configs: 'mythicalmysfits-kube-canary.yml',
                    enableConfigSubstitution: true
                    )
           }
       }
   }