from flask import Flask, request, send_file
import os
app = Flask(__name__)
from pdf import main, main2

UPLOADS = "./uploads"
DOWNLOADS = "./downloads"

# file path for where genAI content is stored
download_file_path = "./downloads/moretext.txt"

# @app.route("/home")
# def home():
#     file_path = "./downloads/moretext.txt"
#     with open(file_path, 'r') as file:
#         file_contents = file.read()
#     print(file_contents)
#     return {'body': file_contents}

# Runs the Python script for pdf files (not much error handling)
@app.route("/file", methods=['POST'])
def file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'Not Completed', 500
        file = request.files['file']
        if file.filename == '':
            return 'Not Completed', 500
        print("File Verified")
        # save uploaded file into "uploads"
        file.save(os.path.join(UPLOADS, file.filename))
        
        # writes AI content to the file
        arr = main2(os.path.join(UPLOADS, file.filename), "file")
        with open(download_file_path, 'w') as file:
            file.write(arr)
        return "Download Ready", 200
    return "Not Completed", 500

# Runs the Python script for publically accesssible pdf URLs (not much error handling)
@app.route('/url', methods=['POST'])
def url():
    if (request.method == 'POST'):
        # checks that the data exists
        if request.data == "":
            return 'Not Completed', 500
        else:
            # writes AI content to the file
            arr = main2(request.get_json(), "url")
            with open(download_file_path, 'w') as file:
                file.write(arr)
            return "Download Ready", 200


# Responsible for sending the Gen AI results to frontend
@app.route("/download")
def download():
    with open(download_file_path, 'r') as file:
        file_contents = file.read()
    return {'body': file_contents}

if __name__ == "__main__":
    app.run(debug=True)


