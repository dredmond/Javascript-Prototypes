using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace HexViewer
{
    public partial class Form1 : Form
    {
        public List<FileInfo> Files = new List<FileInfo>();

        public Form1()
        {
            InitializeComponent();

            const string directory = @"C:\Users\Donny\AppData\Roaming\Apple Computer\MobileSync\Backup\180afbd8d349c5d29da1030a646fbc3296877be0\";
            //const string directory = @"C:\Users\Donny\AppData\Roaming\Apple Computer\MobileSync\Backup\7c97e37cefca9d87de0c19da5a791bc7ae78c8ff\";

            TestParse(directory);
        }

        private void TestParse(string directory)
        {
            treeView1.Nodes.Clear();
            Files.Clear();
            textBox2.Clear();
            var filePath = directory + "Manifest.mbdb";
            var parser = new BackupParser(filePath);
            var header = "";

            header = parser.ReadString(4);
            textBox2.AppendText(string.Format("Header: {0}, Location: {1}, Size: {2}\r\n", header, parser.Offset, parser.Length));

            var headerBytes = parser.ReadBytes(2);
            textBox2.AppendText(string.Format("{0:x2} {1:x2}\r\n", headerBytes[0], headerBytes[1]));
            
            while (!parser.HasReachedEof())
            {
                var file = new FileInfo(parser);
                Files.Add(file);

                var node = new HexViewerNode(file);
                treeView1.Nodes.Add(node);
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // treeView1.Nodes.Clear();
            /*
            var rootNode = new TreeNode(textBox1.Text);
            treeView1.Nodes.Add(rootNode);

            Directory.SetCurrentDirectory(textBox1.Text);

            var files = Directory.GetFiles(textBox1.Text, "*.mbdb", SearchOption.AllDirectories);

            foreach (var file in files)
            {
                rootNode.Nodes.Add(file.Replace(textBox1.Text, ""));
            }
            treeView1.Refresh();*/
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            textBox2.Clear();
            textBox2.AppendText("File: " + e.Node.Text + "\r\n\r\n");

            var fileNode = e.Node as HexViewerNode;

            if (fileNode == null)
                return;

            textBox2.AppendText(string.Format("FileNameHash:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.FileNameHash)));
            textBox2.AppendText(string.Format("Domain: {0}\r\n", fileNode.Info.Domain));
            textBox2.AppendText(string.Format("Path: {0}\r\n", fileNode.Info.Path));
            textBox2.AppendText(string.Format("File Size: {0} bytes\r\n", fileNode.Info.Size));
            textBox2.AppendText(string.Format("\r\nUnknown:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.Unknown)));
            textBox2.AppendText(string.Format("File Hash:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.FileHash)));
            textBox2.AppendText(string.Format("Unknown2:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.Unknown2)));
            textBox2.AppendText(string.Format("Unknown3:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.Unknown3)));
            textBox2.AppendText(string.Format("Unknown4:\r\n{0}\r\n", HexToString(8, 4, fileNode.Info.Unknown4)));

            foreach (var property in fileNode.Info.Properties)
            {
                textBox2.AppendText(string.Format("Property: {0}\r\n{1}\r\n", property.Name, HexToString(8, 4, property.Value)));
            }
        }

        private static string HexToString(int size, int width, byte[] data)
        {
            var result = new StringBuilder();

            for (var i = 0; i < data.Length; i += size * width)
            {
                result.AppendLine(WriteHexLine(i, size, width, data) + "     " + WriteAsciiLine(i, size, width, data));
            }

            return result.ToString();
        }

        private static string WriteHexLine(int offset, int size, int width, byte[] data)
        {
            var result = new StringBuilder();
            var bytesWritten = 0;

            for (var i = offset; i < data.Length && bytesWritten < size * width; i++, bytesWritten++)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                result.Append(String.Format("{0:x2}", data[i]));
            }

            while (bytesWritten < size * width)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                result.Append("  ");
                bytesWritten++;
            }

            return result.ToString();
        }

        private static string WriteAsciiLine(int offset, int size, int width, byte[] data)
        {
            var result = new StringBuilder();
            var bytesWritten = 0;

            for (var i = offset; i < data.Length && bytesWritten < size * width; i++, bytesWritten++)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                if (data[i] > 31 && data[i] < 128)
                    result.Append(Convert.ToChar(data[i]));
                else
                    result.Append(".");
            }

            return result.ToString();
        }
    }
}
