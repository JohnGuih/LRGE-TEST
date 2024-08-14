import sys
import zipfile
import os

def main():
    logs = []

    try:
        if   len(sys.argv) != 3:
            print("Usage: python script.py <temp_folder_path> <zip_file_path>")
            print("Reicived arguments:\n", "\n".join(sys.argv))
            sys.exit(1)

        temp_folder_path = sys.argv[1]
        zip_file_path = sys.argv[2]

        logs.append(f"Temp folder path: {temp_folder_path}")
        logs.append(f"Zip file path: {zip_file_path}")

        with zipfile.ZipFile(zip_file_path, 'r') as zip_file:
            zip_file.extractall(temp_folder_path)

        folder_content = os.listdir(temp_folder_path)
        print(folder_content)

    except Exception as e:
        logs.append(f"Error: {e}")

    finally:
        for log in logs:
            print(log)

if __name__ == '__main__':
    main()