pipeline {
    agent any

    environment {
        PROJECT_DIR = "./" // because it'll be cloned into workspace
    }

    stages {
        stage('Build & Deploy') {
            steps {
                echo "🛠 Building Docker containers..."
                sh "docker-compose down || true"
                sh "docker-compose up --build -d"
            }
        }

        stage('Verify') {
            steps {
                sh "docker ps"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed!"
        }
        failure {
            echo "❌ Something broke!"
        }
    }
}
