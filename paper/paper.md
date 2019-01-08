---
title: "DNAvisualization.org: an entirely serverless web tool for DNA sequence visualization"
author:
  - Benjamin D. Lee:
      institute:
        - Lab41
        - HMS
        - SEAS
      email: benjamindlee@me.com
      orcid: 0000-0002-7133-8397
      correspondence: "yes"
  - Michael A. Timony:
      institute:
        - HMS
        - SBGrid
  - Pablo Ruiz:
      institute: SEAS
institute:
  - Lab41:
      name: "In-Q-Tel Lab41"
      address: "800 El Camino Real, Suite 300, Menlo Park, CA 94025, USA"
  - HMS:
      name: "Harvard Medical School"
      address: "277 Avenue Louis Pasteur, Boston, MA 02115, USA"
  - SEAS:
      name: "School of Engineering and Applied Sciences, Harvard University"
      address: "29 Oxford St., Cambridge, MA 02138, USA"
  - SBGrid:
      name: "SBGrid"
bibliography: DNAvisualization.org.bib
project:
    title: Pandoc Scholar Example
    zip-url: https://github.com/pandoc-scholar/pandoc-scholar/releases
    github-url: https://github.com/pandoc-scholar/pandoc-scholar/
---

# Abstract

Raw DNA sequences contain an immense amount of meaningful biological information. However, these sequences are hard for humans to intuitively interpret. To solve this problem, a number of methods have been proposed to transform DNA sequences into two-dimensional visualizations. DNAvisualization.org implements several of these methods in a cost effective and high-performance manner via a novel entirely serverless architecture. By taking advantage of recent advances in serverless parallel computing and selective data retrieval, the website is able to offer users the ability to visualize up to thirty 4.5 Mbp DNA sequences simultaneously in seconds using one of five supported methods.


# Introduction

As DNA sequencing technology becomes more commonplace, tools for the analysis of its data are among the most cited papers in science [@wrenBioinformaticsProgramsAre2016]. The reason is simple: DNA sequences are, by themselves, almost completely unintelligible to humans. Seeing meaningful patterns in DNA sequences (which are often too large to be shown in their entirety on a screen) is a significant challenge for researchers. One approach to addressing this problem is to convert DNA sequences into two-dimensional visualizations that capture some part of the biological information contained within the sequences. This has the benefit of taking advantage of the highly developed human visual system, which is capable of tremendous feats of pattern recognition and memory [@bradyVisualLongtermMemory2008].

A variety of methods have been proposed to convert DNA sequences into two dimensional visualizations [@randicCompact2DGraphical2003; @qiUsingHuffmanCoding2011; @guoNumericalCharacterizationDNA2003; @yauDNASequenceRepresentation2003; @gatesSimpleWayLook1986; @zou2DGraphicalRepresentation2014; @jeffreyChaosGameRepresentation1990; @pengLongrangeCorrelationsNucleotide1992; @leeSquiggleUserfriendlyTwodimensional2018; @bariEffectiveEncodingDNA2013]. These methods are highly heterogenous, but, for the sake of this paper, we will only discuss methods with no degeneracy, *i.e.* methods that produce visualizations which may be unambiguously transformed back into the DNA sequence from which they were generated. All of these methods share a single feature: they map each nucleotide in a DNA sequence to one or more points in the Cartesian plane.

One effect of mapping each base to at least one point is that the number of points grows linearly with the length of the DNA sequence. This poses a technological challenge, as the technology to sequence DNA has vastly outpaced tools to visualize it. Indeed, there is currently a dearth of DNA visualization tools capable of implementing the variety of methods that have been introduced in the literature [@thomasGraphDNAJavaProgram2007; @arakawaGenomeProjectorZoomable2009; @leeSquiggleUserfriendlyTwodimensional2018]. 

# Methods

## Interface

The user interface for the tool is deliberately simple. A user first selects a visualization method from one of the five currently supported methods [@yauDNASequenceRepresentation2003;@gatesSimpleWayLook1986;@leeSquiggleUserfriendlyTwodimensional2018;@qiNovel2DGraphical2007], then provides FASTA-formatted sequence data to visualize, either by using the operating system's file input prompt, dragging-and-dropping files onto the window, pasting files, clicking a button to load example data, or pasting the raw data into a text prompt. Upon receipt of sequence data, a loading spinner indicates that the system is processing the data. After the data processing is complete, the loading spinner is replaced with the two-dimensional visualization. 

The initial view is such that the entirety of each sequence's visualization is visible: every part of every sequence can be seen. This poses an immediate challenge, as comparing sequences of vastly different lengths will result in the smaller sequence being so small as to be essentially invisible. To solve this problem, the tool allows users to toggle the visibility of sequences by clicking on the corresponding legend entry, which will automatically rescale the visualization's axes to fit the displayed sequences. 



## Implementation

The web tool is built using a novel entirely serverless architecture. To understand how this system differs from a traditional architecture, consider a traditional approach to building the DNAvisualization.org tool. A server, usually running Linux or Microsoft Windows, is established to handle HTTP requests to the website. This server is either maintained by a university or, increasingly often, a cloud services provider. If there are no requests (as can be expected to be a significant fraction of the time for most websites), the server sits idle. When requests are submitted, the server responds to each one. If the server is at capacity, requests may wait unanswered or, with additional complexity, more servers may be automatically requested from cloud services provider to meet the greater demand. Data storage is usually provided by a SQL-based relational database management system (RDBMS), which must also be running on a server. 

This paradigm has several disadvantages: disruptions to the server result in disruptions to the website, greater expertise is required for the development and maintenance of the website, the server wastes resources while sitting idle, and the server's computational and storage capacity is directly limited by its hardware.

# Results and Discussion

## Performance



# Conclusion

# Data Availability

The website is freely accessible at [https://DNAvisualization.org](https://dnavisualization.org).

# References
