using System.Windows.Forms;

namespace HexViewer
{
    public class HexViewerNode : TreeNode
    {
        public FileInfo Info { get; private set; }

        public HexViewerNode(FileInfo fileInfo)
        {
            Info = fileInfo;
            Text = Info.Domain + "-" + Info.Path;
        }

        public override string ToString()
        {
            return Info.Domain + "-" + Info.Path;
        }
    }
}
